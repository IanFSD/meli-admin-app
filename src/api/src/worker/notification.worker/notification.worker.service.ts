import {Inject, Injectable, Logger} from '@nestjs/common';
import {Job} from 'bull';
import {Process, Processor} from '@nestjs/bull';
import {ItemNotificationService} from "./item.notification/item.notification.service";
import {OrderNotificationService} from "./order.notification/order.notification.service";
import {JobQueueCommand, JobQueueInterface} from "../../resources/interface/job.queue.interface";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../../resources/entity/user.entity";
import {Repository} from "typeorm";
import {UserDataEntity} from "../../resources/entity/user.data.entity";
import {NotificationInterface} from "../../resources/interface/notification.interface";

/**
 * AdminMeliNotificationService se encarga procesar los jobs que llegan a colas del tipo MELI_NOTIFICATION.
 * La API de cliente recibe notificaciones de ML y las crea jobs en este cola, las crea el NotificationService.
 * Se recibe el job y se procesa: se graba la notificacion en ClientMeliNotification, si es del tipo venta se busca
 * en ML la venta y se la graba en ClientMeliOrder.
 */
@Injectable()
@Processor(process.env.REDIS_QUEUE)
export class NotificationWorkerService {
    private logger: Logger;

    constructor(@InjectRepository(UserDataEntity) private readonly repoUserData: Repository<UserDataEntity>,
                @Inject(ItemNotificationService) private readonly itemNotificationService: ItemNotificationService,
                @Inject(OrderNotificationService) private readonly orderNotificationService: OrderNotificationService) {
        this.logger = new Logger(this.constructor.name);
    }

    // @Process(process.env.NOTIFICATION_JOB)
    @Process('NOTIFICATION')
    async processJob(job: Job) {
        this.logger.debug(`Processing job ${job.id} of type ${job.name} with data ${JSON.stringify(job.data)}`);
        const jobData: JobQueueInterface<NotificationInterface> = job.data;
        try {
            // Valido el usuario
            const userData = await this.repoUserData.findOne({where: {user_id: jobData.item.user_id}})
            if(userData) {
                // busco una MeliApp
                switch (jobData.command) {
                    case JobQueueCommand.NOTIFICATION_ORDERS :
                    case JobQueueCommand.NOTIFICATION_ORDERS_V2 :
                        return this.order(job);
                    case JobQueueCommand.NOTIFICATION_ITEMS :
                        return this.item(job);
                    case JobQueueCommand.NOTIFICATION_PAYMENTS :
                    // return this.payment(job, meli, queue);
                    case JobQueueCommand.NOTIFICATION_CREATED_ORDERS :
                    case JobQueueCommand.NOTIFICATION_QUESTIONS :
                    case JobQueueCommand.NOTIFICATION_PICTURES :
                    case JobQueueCommand.NOTIFICATION_MESSAGES :
                    case JobQueueCommand.NOTIFICATION_SHIPMENTS :
                    case JobQueueCommand.NOTIFICATION_QUOTATIONS :
                    case JobQueueCommand.NOTIFICATION_INVOICES :
                    case JobQueueCommand.NOTIFICATION_CLAIMS :
                    case JobQueueCommand.NOTIFICATION_ITEM_COMPETITION :
                        // return this.notification(job);
                        return null;
                    default:
                        const errorMessage = `Llego un comando (${jobData.command}) desconocido`;
                        this.logger.error(errorMessage + `: ${JSON.stringify(jobData)}`);
                        await job.log(errorMessage);
                        return {result: 'No OK'};
                }
            } else {
                this.logger.error(`Llego una notificacion con user_id desconocido ${JSON.stringify(jobData)}`);
            }
        } catch (err) {
            this.logger.error(`Ocurrio un error procesar la notificacion ${JSON.stringify(jobData)}`, err);
            throw err;
        }
    }

    private order(job: Job): Promise<any> {
        return this.orderNotificationService.process(job);
    }

    private item(job: Job): Promise<any> {
        return this.itemNotificationService.process(job);
    }
}
