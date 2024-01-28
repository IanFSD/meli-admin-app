import {Job} from "bull";
import {Inject, Logger} from "@nestjs/common";
import {MercadolibreConnectionService} from "../../../mercadolibre.connection/mercadolibre.connection.service";
import {getTrace} from "../../../resources/utilities/utils";

export class OrderNotificationService {
    private logger: Logger;

    constructor(@Inject(MercadolibreConnectionService) private readonly mercadolibreConnectionService: MercadolibreConnectionService) {
        this.logger = new Logger(this.constructor.name);
    }

    async process(job: Job): Promise<any> {
        // const jobData: JobQueueInterface<NotificationInterface> = job.data;
        try {
            // const conn: Connection = getConnection();
            // this.logger.debug(`Llego job ${job.id} con ${JSON.stringify(jobData)}`);
            // return await conn.transaction(async (manager) => {
            //     this.logger.debug(`Leo el recurso de MELI`);
            //     const order: OrderInterface = await this.mercadolibreConnectionService.get(jobData.item.resource);
            //     job.log(JSON.stringify(order));
            //     // const productRepo: Repository<ProductEntity> = manager.getRepository<ProductEntity>(ProductEntity.name),
            //     //     codes = order.order_items.map(x => x.item.seller_custom_field);
            //     // this.logger.debug(`obtengo los productos comprados`);
            //     // const products = await productRepo.find({where: {user_id: jobData.user_id, id: In(codes)}});
            //     const orderRepo: Repository<OrderEntity> = manager.getRepository<OrderEntity>(OrderEntity.name);
            //     this.logger.debug(`Leo la order guardada ${order.id}`);
            //     const orderDB = await orderRepo.findOne({where: {id: order.id}});
            //     if (orderDB) {
            //         this.logger.debug(`Existe la order ${order.id}, la actualizo`);
            //         const item: any = {order: order};
            //         await orderRepo.update({id: order.id}, item);
            //         // encolo job para cliente con datos de la compra
            //         const orderJob: JobQueueInterface<OrderInterface> = {
            //             command: JobQueueCommand.ORDER_PRODUCT,
            //             item: order
            //         };
            //         this.logger.debug(`Encolo job para el agente ${messageQueueType}`);
            //         return await this.messageQueueService.sendMessage(jobData.user_id, messageQueueType, orderJob);
            //     } else {
            //         this.logger.debug(`No existe la order ${order.id}, la inserto`);
            //         const item: any = {user_id: jobData.user_id, id: order.id, order: order};
            //         await orderRepo.insert(item);
            //         // encolo job para cliente con datos de la compra
            //         const orderJob: JobQueueInterface<OrderInterface> = {
            //             user_id: jobData.user_id,
            //             command: JobQueueCommand.ORDER_PRODUCT,
            //             item: order
            //         };
            //         this.logger.debug(`Encolo job para el agente ${jobData.user_id} - ${messageQueueType}`);
            //         return await this.messageQueueService.sendMessage(jobData.user_id, messageQueueType, orderJob);
            //     }
            // })
        } catch (err) {
            this.logger.error(`Error al procesar el job ${job.id} con ${JSON.stringify(job.data)}`, getTrace(err));
            throw err;
        }
    }
}
