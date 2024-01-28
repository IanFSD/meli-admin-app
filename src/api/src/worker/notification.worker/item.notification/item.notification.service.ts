import {Job} from "bull";
import {Inject, Logger} from "@nestjs/common";
import {JobQueueInterface} from "../../../resources/interface/job.queue.interface";
import {NotificationInterface} from "../../../resources/interface/notification.interface";
import {ItemInterface} from "../../../resources/interface/item.interface";
import {getTrace} from "../../../resources/utilities/utils";
import {ItemProcessService} from "../../processes/item/item.process.service";
import {MercadolibreConnectionService} from "../../../mercadolibre.connection/mercadolibre.connection.service";

export class ItemNotificationService {
    private logger: Logger;

    constructor(@Inject(ItemProcessService) private readonly itemProcessService: ItemProcessService,
                @Inject(MercadolibreConnectionService) private readonly mercadolibreConnectionService: MercadolibreConnectionService) {
        this.logger = new Logger(this.constructor.name);
    }

    async process(job: Job): Promise<any> {
        const jobData: JobQueueInterface<NotificationInterface> = job.data;
        try {
            // leo el recurso de meli
            const meliItem: ItemInterface = await this.mercadolibreConnectionService.get(jobData.item.resource);
            await this.itemProcessService.processItem(meliItem);
            // // si el estado es closed y el subestado es deleted, entonces hay que eliminar la publicacion
            // if ((item.status === ITEM_STATUS_CLOSED || item.status === ITEM_STATUS_INACTIVE) &&
            //     Array.isArray(item.sub_status) && item.sub_status.includes(ITEM_SUB_STATUS_DELETED)) {
            //     await this.repoItem.delete({user_id: jobData.user_id, id: item.id});
            //     return {result: 'OK - Item deleted'};
            // } else {
            //     const dbItem = await this.repoItem.findOne({where: {user_id: jobData.user_id, id: item.id}});
            //     if (dbItem) {
            //         await this.repoItem.update({user_id: jobData.user_id, id: item.id}, dbItem);
            //     } else {
            //         item.user_id = jobData.user_id;
            //         await this.repoItem.insert(item);
            //     }
            //     return {result: 'OK - Item downloaled'};
            // }
        } catch (err) {
            this.logger.error(`Error al procesar item ${JSON.stringify(jobData)}`, getTrace(err));
            return {result: 'No OK'};
        }
    }
}
