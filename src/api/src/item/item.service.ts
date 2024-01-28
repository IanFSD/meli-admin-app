import {Injectable, Logger} from "@nestjs/common";
import {Job, Queue} from "bull";
import {Repository} from "typeorm";
import {InjectQueue} from "@nestjs/bull";
import {ConfigService} from "@nestjs/config";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {ItemEntity} from "../resources/entity/item.entity";
import {JobQueueCommand, JobQueueInterface} from "../resources/interface/job.queue.interface";
import {getTrace} from "../resources/utilities/utils";
import {LinkItemDto} from "../resources/dto/link.item.dto";
import {LinkItemVariationDto} from "../resources/dto/link.item.variation.dto";

/**
 * MeliItemService se encarga de visualizar las publicaciones de ML, linkear una publicación con un producto.
 * Se puede pedir la baja masiva de publicaciones de ML creando un job de tipo MELI_BULK, que posteriormente
 * el central procesará
 */
@Injectable()
export class ItemService extends TypeOrmCrudService<ItemEntity> {
    private logger: Logger;

    constructor(@InjectQueue(process.env.REDIS_QUEUE) private readonly queue: Queue,
                @InjectRepository(ItemEntity) repo: Repository<ItemEntity>) {
        super(repo);
        this.logger = new Logger(this.constructor.name);
    }

    downloadItems(): Promise<Job> {
        const job: JobQueueInterface<any> = {
            command: JobQueueCommand.ITEMS_DOWNLOAD,
            item: {}
        };
        return this.queue.add(process.env.BULK_JOB, job).then((res) => {
            return res;
        }).catch((err) => {
            this.logger.error(`Error al encolar un job de MELI BULK - ${job}`, getTrace(err));
            throw err;
        })
    }

    updateItems(): Promise<Job> {
        const job: JobQueueInterface<any> = {
            command: JobQueueCommand.ITEMS_UPDATE,
            item: {}
        };
        return this.queue.add(process.env.BULK_JOB, job).then((res) => {
            return res;
        }).catch((err) => {
            this.logger.error(`Error al encolar un job de MELI BULK - ${job}`, getTrace(err));
            throw err;
        })
    }

    linkItem(data: LinkItemDto): Promise<any> {
        const job: JobQueueInterface<LinkItemDto> = {
            command: JobQueueCommand.ITEM_LINK,
            item: data
        };
        return this.queue.add(process.env.ITEM_JOB, job);
    }

    unlinkItem(data: LinkItemDto) {
        const job: JobQueueInterface<LinkItemDto> = {
            command: JobQueueCommand.ITEM_UNLINK,
            item: data
        };
        return this.queue.add(process.env.ITEM_JOB, job);
    }

    linkVariation(data: LinkItemVariationDto) {
        const job: JobQueueInterface<LinkItemVariationDto> = {
            command: JobQueueCommand.ITEM_VARIATION_LINK,
            item: data
        };
        return this.queue.add(process.env.ITEM_JOB, job);
    }

    unlinkVariation(data: LinkItemVariationDto) {
        const job: JobQueueInterface<LinkItemVariationDto> = {
            command: JobQueueCommand.ITEM_VARIATION_UNLINK,
            item: data
        };
        return this.queue.add(process.env.ITEM_JOB, job);
    }
}
