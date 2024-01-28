import {Injectable, Logger} from "@nestjs/common";
import {EntityManager, getConnection, Repository} from "typeorm";
import {ItemEntity} from "../../../resources/entity/item.entity";
import {ItemInterface} from "../../../resources/interface/item.interface";
import {
    ITEM_STATUS_ACTIVE,
    ITEM_STATUS_CLOSED,
    ITEM_STATUS_PAUSED,
    ITEM_STATUS_UNDER_REVIEW,
    RESULT_OK
} from "../../../resources/utilities/consts";
import {getTrace} from "../../../resources/utilities/utils";
import {ItemVariationEntity} from "../../../resources/entity/item.variation.entity";

@Injectable()
export class ItemProcessService {
    private logger: Logger;

    constructor() {
        this.logger = new Logger(this.constructor.name);
    }

    async processItem(meliItem: ItemInterface) {
        return await getConnection().manager.transaction(async (manager) => {
            let ret: any;
            const repoItem = manager.getRepository<ItemEntity>(ItemEntity.name);
            switch (meliItem.status) {
                case ITEM_STATUS_ACTIVE:
                case ITEM_STATUS_PAUSED:
                case ITEM_STATUS_UNDER_REVIEW:
                    ret = await this.saveItem(repoItem, meliItem, manager);
                    break;
                case  ITEM_STATUS_CLOSED:
                    if (meliItem.sub_status.findIndex(x => x === 'deleted') > -1) {
                        ret = await this.deleteItem(meliItem, manager);
                    } else {
                        ret = await this.saveItem(repoItem, meliItem, manager);
                    }
                    break;
                default:
                    this.logger.error(`publicacion con status desconocido ${meliItem.id} -  ${meliItem.status} - ${JSON.stringify(meliItem.sub_status)}`);
                    ret = RESULT_OK;
                    break;
            }
            this.logger.debug(`Item ${meliItem.id} procesado ${ret}`);
            return ret;
        }).catch(err => {
            this.logger.error(`Al procesar el item meli ${JSON.stringify(meliItem)}`, getTrace(err));
            throw err;
        })
    }

    private async saveItem(repoItem: Repository<ItemEntity>, meliItem: ItemInterface, manager: EntityManager) {
        const dbItem = await repoItem.findOne({
            where: {id: meliItem.id},
            relations: ['Variations']
        });
        if (dbItem) { // existe --> update!
            await repoItem.update({id: meliItem.id}, {
                title: meliItem.title,
                thumbnail: meliItem.thumbnail,
                price: meliItem.price,
                permalink: meliItem.permalink,
                available_quantity: meliItem.available_quantity,
                status: meliItem.status,
                sub_status: meliItem.sub_status,
                seller_custom_field: meliItem.seller_custom_field,
                category_id: meliItem.category_id,
                health: meliItem.health,
                listing_type_id: meliItem.listing_type_id,
                json: meliItem
            });
            // inserto o actualizo las variaciones
            const repoVariation = manager.getRepository<ItemVariationEntity>(ItemVariationEntity.name);
            for (const variation of meliItem.variations) {
                variation.id = String(variation.id);
                const index = dbItem.Variations.findIndex(x => x.id === variation.id);
                if (index > -1) {
                    const dbVariation = dbItem.Variations[index];
                    dbVariation.available_quantity = variation.available_quantity;
                    dbVariation.price = variation.price;
                    dbVariation.json = variation;
                    dbVariation.seller_custom_field = variation.seller_custom_field;
                    dbVariation.thumbnail = meliItem.pictures.find(x => x.id === variation.picture_ids[0]).url;
                    dbVariation.permalink = meliItem.permalink;
                    await repoVariation.update({
                        item_id: dbVariation.item_id,
                        id: dbVariation.id
                    }, dbVariation);
                    dbItem.Variations.splice(index, 1);
                } else {
                    await repoVariation.insert({
                        id: variation.id,
                        item_id: dbItem.id,
                        seller_custom_field: variation.seller_custom_field,
                        price: variation.price,
                        available_quantity: variation.available_quantity,
                        thumbnail: meliItem.pictures.find(x => x.id === variation.picture_ids[0]).url,
                        permalink: meliItem.permalink,
                        json: variation
                    });
                }
            }
            // elimino variaciones
            for (const dbVariation of dbItem.Variations) {
                await repoVariation.delete({
                    item_id: dbVariation.item_id,
                    id: dbVariation.id
                });
            }
        } else { // no existe --> Insert
            await repoItem.insert({
                id: meliItem.id,
                title: meliItem.title,
                thumbnail: meliItem.thumbnail,
                price: meliItem.price,
                permalink: meliItem.permalink,
                available_quantity: meliItem.available_quantity,
                status: meliItem.status,
                sub_status: meliItem.sub_status,
                seller_custom_field: meliItem.seller_custom_field,
                category_id: meliItem.category_id,
                health: meliItem.health,
                listing_type_id: meliItem.listing_type_id,
                json: meliItem
            });
            const repoVariation = manager.getRepository<ItemVariationEntity>(ItemVariationEntity.name);
            for (const variation of meliItem.variations) {
                await repoVariation.insert({
                    id: variation.id,
                    item_id: meliItem.id,
                    seller_custom_field: variation.seller_custom_field,
                    price: variation.price,
                    available_quantity: variation.available_quantity,
                    thumbnail: meliItem.pictures.find(x => x.id === variation.picture_ids[0]).url,
                    permalink: meliItem.permalink,
                    json: variation
                });
            }
        }
        return RESULT_OK;
    }

    private async deleteItem(meliItem: ItemInterface, manager: EntityManager) {
        const repoItem = manager.getRepository<ItemEntity>(ItemEntity.name);
        const dbItem = await repoItem.findOne({where: {id: meliItem.id}});
        if (dbItem) {
            const repoVariation = manager.getRepository<ItemVariationEntity>(ItemVariationEntity.name);
            await repoVariation.delete({item_id: dbItem.id});
            await repoItem.update({id: meliItem.id}, meliItem);
        }
        return RESULT_OK
    }
}
