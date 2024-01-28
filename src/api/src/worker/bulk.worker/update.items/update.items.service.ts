import {Job} from "bull";
import {In, IsNull, Not, Repository} from "typeorm";
import {Inject, Logger} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {ItemEntity} from "../../../resources/entity/item.entity";
import {ProductEntity} from "../../../resources/entity/product.entity";
import {ItemWorkerService} from "../../item.worker/item.worker.service";
import {JobQueueInterface} from "../../../resources/interface/job.queue.interface";
import {ITEM_STATUS_CLOSED, ITEM_STATUS_UNDER_REVIEW} from "../../../resources/utilities/consts";

export class UpdateItemsService {
    private logger: Logger;

    constructor(@InjectRepository(ItemEntity) private readonly repoItem: Repository<ItemEntity>,
                @InjectRepository(ProductEntity) private readonly repoProduct: Repository<ProductEntity>,
                @Inject(ItemWorkerService) private readonly itemService: ItemWorkerService) {
        this.logger = new Logger(this.constructor.name);
    }

    /**
     * Actualiza masivamente las publicaciones.
     * Primero se obtienen las publicaciones y los productos.
     * Segundo se recorre la lista de publicaciones y se actuliza con los datos de los productos.
     */
    async process(job: Job) {
        const jobData: JobQueueInterface<string> = job.data;
        this.logger.debug(`busco todos los items`);
        const items = await this.repoItem.find({
            where: {
                status: Not(In([ITEM_STATUS_CLOSED, ITEM_STATUS_UNDER_REVIEW])),
                seller_custom_field: Not(IsNull()),
            },
            relations: ['Variations', 'Product']
        });
        const products = await this.repoProduct.find();
        items.forEach(item => {
            const product = products.find(p => String(p.id) === item.seller_custom_field && p.provider === jobData.item);
            if (product) {
                this.logger.debug(`Actualizo el item ${item.id} con seller_custom_field ${item.seller_custom_field}`);
                this.itemService.updateItemOnMeli(item);
            } else {
                this.logger.warn(`El item ${item.id} no tiene seller_custom_field conocido [${item.seller_custom_field}], no se actualiza`);
            }
        })
    }
}
