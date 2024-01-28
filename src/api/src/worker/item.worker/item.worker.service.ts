import {Inject, Injectable, Logger} from '@nestjs/common';
import {Job} from 'bull';
import {getConnection, In, Not, Repository} from 'typeorm';
import {Process, Processor} from "@nestjs/bull";
import {InjectRepository} from "@nestjs/typeorm";
import {ItemEntity} from "../../resources/entity/item.entity";
import {ProductEntity} from "../../resources/entity/product.entity";
import {ItemVariationEntity} from "../../resources/entity/item.variation.entity";
import {MercadolibreConnectionService} from "../../mercadolibre.connection/mercadolibre.connection.service";
import {JobQueueCommand, JobQueueInterface} from "../../resources/interface/job.queue.interface";
import {ProductInterface} from "../../resources/interface/product.interface";
import {getTrace} from "../../resources/utilities/utils";
import {
    ITEM_STATUS_ACTIVE,
    ITEM_STATUS_CLOSED,
    ITEM_STATUS_PAUSED,
    ITEM_STATUS_UNDER_REVIEW,
    ITEM_SUB_STATUS_DELETED,
    RESULT_OK
} from "../../resources/utilities/consts";
import {LinkItemDto} from "../../resources/dto/link.item.dto";
import {LinkItemVariationDto} from "../../resources/dto/link.item.variation.dto";

/**
 *
 */
@Injectable()
@Processor(process.env.REDIS_QUEUE)
export class ItemWorkerService {
    private logger: Logger;

    constructor(@InjectRepository(ItemEntity) private readonly repoItem: Repository<ItemEntity>,
                @InjectRepository(ProductEntity) private readonly repoProduct: Repository<ProductEntity>,
                @InjectRepository(ItemVariationEntity) private readonly repoVariation: Repository<ItemVariationEntity>,
                @Inject(MercadolibreConnectionService) private readonly mercadolibreConnectionService: MercadolibreConnectionService) {
        this.logger = new Logger(this.constructor.name);
    }

    // @Process(process.env.ITEM_JOB)
    @Process('ITEM')
    async processJob(job: Job): Promise<any> {
        const jobData: JobQueueInterface<ProductInterface> = job.data;
        this.logger.debug(`Llego el job ${job.id} - ${JSON.stringify(jobData)}`);
        try {
            // Dependiendo del comando del job hago lo que corresponda
            switch (jobData.command) {
                case JobQueueCommand.ITEM_PAUSE:
                    job.data.item.active = false;
                    return this.updateItem(job);
                case JobQueueCommand.ITEM_UPDATE:
                    return this.updateItem(job);
                case JobQueueCommand.ITEM_LINK:
                    return this.linkItem(job);
                case JobQueueCommand.ITEM_UNLINK:
                    return this.unlinkItem(job);
                case JobQueueCommand.ITEM_VARIATION_LINK:
                    return this.linkItemVariation(job);
                case JobQueueCommand.ITEM_VARIATION_UNLINK:
                    return this.unlinkItemVariation(job);
                default:
                    const errorMessage = `Llego un comando [${jobData.command}] desconocido`;
                    this.logger.error(errorMessage + `: ${JSON.stringify(jobData)}`);
                    await job.log(errorMessage);
                    return {result: 'No OK'}
            }
        } catch (err) {
            this.logger.error(`Error al procesa item ${jobData}`, getTrace(err));
            throw err;
        }
    }

    async updateItemOnMeli(dbItem: ItemEntity) {
        // genero los parametros de la publicacion
        const url = `items/${dbItem.id}`,
            params: any = this.generateMeliItemParams(dbItem);
        // si el estado es active entonces hago una mofidicacion (put)
        switch (dbItem.status) {
            case ITEM_STATUS_ACTIVE:
            case ITEM_STATUS_PAUSED:
                // grabo los nuevos parametros de la publicacion en MELI
                await this.mercadolibreConnectionService.put(url, params);
                break;
            case  ITEM_STATUS_CLOSED:
                if (dbItem.sub_status.findIndex(x => x === ITEM_SUB_STATUS_DELETED) > -1) {
                    // item eliminado, no hago nada
                    this.logger.debug(`publicacion eliminada ${dbItem.id} - ${dbItem.status} - ${JSON.stringify(dbItem.sub_status)} - no hago nada`);
                } else {
                    // si el estado es close y el nuevo stock > 0 entonces hago una re-publicacion (post)
                    if (dbItem.available_quantity > 0) {
                        // grabo los nuevos parametros de la re-publicacion en MELI
                        params.quantity = params.available_quantity;
                        params.listing_type_id = dbItem.listing_type_id;
                        delete params.status;
                        delete params.available_quantity;
                        await this.mercadolibreConnectionService.post(url + '/relist', params)
                    } else {
                        // en otro caso no modifico nada
                        this.logger.error(`OTRO CASO: ${dbItem}`)
                    }
                }
                break;
            case ITEM_STATUS_UNDER_REVIEW:
                this.logger.debug(`publicacion bajo revision ${dbItem.id} - ${dbItem.status} - ${JSON.stringify(dbItem.sub_status)} - no hago nada`);
                break;
            default:
                this.logger.error(`publicacion con status desconocido ${dbItem.id} -  ${dbItem.status} - ${JSON.stringify(dbItem.sub_status)}`);
                break;
        }
    }

    async updateItemVariationOnMeli(dbItem: ItemEntity, variationId: string) {
        // genero los parametros de la publicacion
        const url = `items/${dbItem.id}/variations/${variationId}`,
            params: any = this.generateMeliItemVariationParams(dbItem, variationId);
        // si el estado es active entonces hago una mofidicacion (put)
        switch (dbItem.status) {
            case ITEM_STATUS_ACTIVE:
            case ITEM_STATUS_PAUSED:
                // grabo los nuevos parametros de la publicacion en MELI
                await this.mercadolibreConnectionService.put(url, params);
                break;
            case  ITEM_STATUS_CLOSED:
                this.logger.debug(`publicacion cerrada ${dbItem.id} - ${dbItem.status} - ${JSON.stringify(dbItem.sub_status)} - no hago nada`);
                break;
            case ITEM_STATUS_UNDER_REVIEW:
                this.logger.debug(`publicacion bajo revision ${dbItem.id} - ${dbItem.status} - ${JSON.stringify(dbItem.sub_status)} - no hago nada`);
                break;
            default:
                this.logger.error(`publicacion con status desconocido ${dbItem.id} -  ${dbItem.status} - ${JSON.stringify(dbItem.sub_status)}`);
                break;
        }
    }

    private getComision(dbItem: ItemEntity) {
        let ret = 13;
        if (dbItem.listing_type_id === 'gold_pro') {
            ret = 28;
        }
        return ret;
    }

    private generateMeliItemParams(dbItem: ItemEntity): any {
        const ret: any = {};
        ret.status = dbItem.status;
        ret.seller_custom_field = dbItem.seller_custom_field;
        if (dbItem.Variations && dbItem.Variations.length > 0) {
            this.setVariations(ret, dbItem);
        } else {
            ret.price = Number(dbItem.price);
            ret.available_quantity = dbItem.available_quantity;
        }
        return ret;
    }

    private generateMeliItemVariationParams(dbItem: ItemEntity, variationId: string): any {
        let ret: any = null;
        for (const variation of dbItem.Variations) {
            if (variation.id === variationId) {
                ret = {
                    id: variation.id,
                    price: Number(dbItem.price),
                    available_quantity: variation.available_quantity,
                    seller_custom_field: variation.seller_custom_field
                }
                break;
            }
        }
        return ret;
    }

    private getStatus(dbItem: ItemEntity, product: ProductEntity | ProductInterface = null) {
        let ret = dbItem.status;
        if (product) {
            ret = product.active ? ITEM_STATUS_ACTIVE : ITEM_STATUS_PAUSED;
            if (Number(product.stock) === 0) {
                ret = ITEM_STATUS_PAUSED;
            }
        }
        return ret;
    }

    private getStock(dbItem: ItemEntity, product: ProductEntity | ProductInterface = null) {
        let ret;
        if (product) {
            ret = product.stock;
        } else {
            ret = dbItem.available_quantity;
        }
        return ret;
    }

    private getPrice(dbItem: ItemEntity, product: ProductEntity | ProductInterface = null) {
        const comision: number = this.getComision(dbItem);
        let price = Number(product ? product.price : dbItem.price);
        price = (((price) / (1 - (comision / 100.0)) - (price)) + price);
        return Math.round((price + Number.EPSILON) * 100) / 100;
    }

    private setVariations(params: any, dbItem: ItemEntity) {
        params.variations = [];
        for (const variation of dbItem.Variations) {
            params.variations.push({
                id: variation.id,
                price: Number(dbItem.price),
                available_quantity: variation.available_quantity,
                seller_custom_field: variation.seller_custom_field
            })
        }
    }

    private async updateItem(job: Job) {
        const jobData: JobQueueInterface<ProductInterface> = job.data;
        return await getConnection().manager.connection.transaction(async (manager) => {
            const repoItem = manager.getRepository<ItemEntity>(ItemEntity.name);
            const repoProduct = manager.getRepository<ProductEntity>(ProductEntity.name);
            const repoVariation = manager.getRepository<ItemVariationEntity>(ItemVariationEntity.name);
            // Busco todas las publicaciones de MELI que se correspondan con el producto a actualizar
            const dbItems: ItemEntity[] = await repoItem
                    .createQueryBuilder('item')
                    .leftJoinAndSelect('item.Variations', 'variation', 'item.user_id = variation.user_id AND item.id = variation.item_id')
                    .where('(item.user_id = :user_id AND item.seller_custom_field = :seller_custom_field AND status NOT IN(:closed, :under_review))')
                    .orWhere(qb => '(item.user_id = :user_id AND item.status NOT IN(:closed, :under_review) AND item.id IN ' + qb.subQuery()
                            .select('variant.item_id')
                            .from(ItemVariationEntity, 'variant')
                            .where('variant.user_id = :user_id AND variant.seller_custom_field = :seller_custom_field')
                            .getQuery()
                        + ')'
                    )
                    .setParameter('seller_custom_field', jobData.item.id)
                    .setParameter('closed', ITEM_STATUS_CLOSED)
                    .setParameter('under_review', ITEM_STATUS_UNDER_REVIEW)
                    .getMany(),
                productCount = await repoProduct.count({where: {id: jobData.item.id}});
            if (dbItems && productCount === 1) {
                this.logger.debug(`actualizo ${dbItems.length} publicaciones`);
                for (const dbItem of dbItems) {
                    if (dbItem.seller_custom_field === String(jobData.item.id)) {
                        dbItem.price = this.getPrice(dbItem, jobData.item);
                        dbItem.available_quantity = this.getStock(dbItem, jobData.item);
                        dbItem.status = this.getStatus(dbItem, jobData.item);
                        this.logger.debug(`actualizo la publicacion ${dbItem.id}`);
                        await repoItem.update({id: dbItem.id}, {
                            price: dbItem.price,
                            available_quantity: dbItem.available_quantity,
                            status: dbItem.status
                        });
                    } else {
                        for (const variation of dbItem.Variations) {
                            if (variation.seller_custom_field === String(jobData.item.id)) {
                                variation.available_quantity = this.getStock(dbItem, jobData.item);
                                this.logger.debug(`actualizo la variacion ${dbItem.id}/${variation.id}`);
                                await repoVariation.update({
                                    item_id: dbItem.id,
                                    id: variation.id
                                }, {available_quantity: variation.available_quantity});
                            }
                        }
                    }
                    this.logger.debug(`actualizo la publicacion ${dbItem.id} en meli`);
                    await this.updateItemOnMeli(dbItem);
                }
            }
            this.logger.debug(`${dbItems.length} items updated`);
            return `${dbItems.length} items updated`;
        }).catch(err => {
            this.logger.error(`Error en updateItem ${jobData}`, getTrace(err));
            throw err;
        })
    }

    private async linkItem(job: Job) {
        const jobData: JobQueueInterface<LinkItemDto> = job.data;
        return await this.linkItemEx(jobData.item.item_id, jobData.item.product_id);
    }

    private async linkItemEx(item_id: string, product_id: string) {
        // busco el item y product
        const dbItem = await this.repoItem.findOne({
                where: {id: item_id, status: Not(In([ITEM_STATUS_CLOSED, ITEM_STATUS_UNDER_REVIEW]))},
                relations: ['Variations']
            }),
            dbProduct = product_id === null ? null : await this.repoProduct.findOne({
                where: {id: product_id}
            });
        if (dbItem && ((product_id && dbProduct) || (product_id === null && dbProduct === null))) {
            dbItem.seller_custom_field = product_id;
            dbItem.available_quantity = this.getStock(dbItem, dbProduct);
            dbItem.price = this.getPrice(dbItem, dbProduct);
            dbItem.status = this.getStatus(dbItem, dbProduct);
            this.logger.debug(`actualizo publicacion ${item_id} en DB`);
            await this.repoItem.update({id: item_id}, {
                seller_custom_field: product_id,
                available_quantity: dbItem.available_quantity,
                price: dbItem.price,
                status: dbItem.status
            });
            this.logger.debug(`actualizo publicacion ${item_id} en meli`);
            await this.updateItemOnMeli(dbItem);
            return RESULT_OK
        } else {
            const str = `No se encontro item con ID ${item_id} y/o producto con ID  ${product_id}`;
            this.logger.warn(str);
            return str;
        }
    }

    private async unlinkItem(job: Job) {
        const jobData: JobQueueInterface<LinkItemDto> = job.data;
        return await this.linkItemEx(jobData.item.item_id, null);
    }

    private async linkItemVariation(job: Job) {
        const jobData: JobQueueInterface<LinkItemVariationDto> = job.data;
        return await this.linkItemVariationEx(jobData.item.variation_id, jobData.item.product_id);
    }

    private async linkItemVariationEx(variation_id: string, product_id: string) {
        // busco el item
        const dbItem = await this.repoItem
                .createQueryBuilder('item')
                .leftJoinAndSelect('item.Variations', 'variation', 'item.user_id = variation.user_id AND item.id = variation.item_id')
                .where({status: Not(In([ITEM_STATUS_CLOSED, ITEM_STATUS_UNDER_REVIEW]))})
                .andWhere(qb => 'item.id = ' + qb.subQuery()
                    .select('variant.item_id')
                    .from(ItemVariationEntity, 'variant')
                    .where('variant.user_id = :user_id AND variant.id = :variation_id')
                    .getQuery()
                )
                .setParameter('variation_id', variation_id)
                .getOne(),
            dbProduct = product_id === null ? null : await this.repoProduct.findOne({
                where: {id: product_id}
            });
        if (dbItem && ((product_id && dbProduct) || (product_id === null && dbProduct === null))) {
            const variation = dbItem.Variations.find(x => x.id === variation_id);
            variation.available_quantity = this.getStock(dbItem, dbProduct);
            variation.seller_custom_field = product_id;
            await this.repoVariation.update({item_id: dbItem.id, id: variation_id}, variation);
            // await this.updateItemOnMeli(dbItem, meliApp);
            await this.updateItemVariationOnMeli(dbItem, variation_id);
            return RESULT_OK
        } else {
            const str = `No se encontro item variation con ID ${variation_id} y/o producto con id ${product_id}`;
            this.logger.warn(str);
            return str;
        }
    }

    private async unlinkItemVariation(job: Job) {
        const jobData: JobQueueInterface<LinkItemVariationDto> = job.data;
        return await this.linkItemVariationEx(jobData.item.variation_id, null);
    }
}
