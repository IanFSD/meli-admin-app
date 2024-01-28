import {Injectable, Logger} from "@nestjs/common";
import {Queue} from "bull";
import {InjectQueue} from "@nestjs/bull";
import {NotificationInterface} from "../resources/interface/notification.interface";
import {JobQueueCommand, JobQueueInterface} from "../resources/interface/job.queue.interface";

/**
 * NotificationService se encarga de recibir las notificaciones de ML y meterlas en la cola de tipo MELI_NOTIFICATION
 * para que la centrar la procese.
 */
@Injectable()
export class MeliNotificationService {
    private logger: Logger;

    constructor(@InjectQueue(process.env.REDIS_QUEUE) private readonly queue: Queue) {
        this.logger = new Logger(this.constructor.name);
    }

    async saveNotification(notification: NotificationInterface) {
        try {
            // Valido que sea la aplicacion correcta
            if (String(notification.application_id) === process.env.MELI_APP_ID) {
                let cmd: JobQueueCommand;
                switch (notification.topic) {
                    case 'orders':
                        cmd = JobQueueCommand.NOTIFICATION_ORDERS;
                        break;
                    case 'orders_v2':
                        cmd = JobQueueCommand.NOTIFICATION_ORDERS_V2;
                        break;
                    case 'items':
                        cmd = JobQueueCommand.NOTIFICATION_ITEMS;
                        break;
                    case 'created_orders':
                        cmd = JobQueueCommand.NOTIFICATION_CREATED_ORDERS;
                        break;
                    case 'questions':
                        cmd = JobQueueCommand.NOTIFICATION_QUESTIONS;
                        break;
                    case 'payments':
                        cmd = JobQueueCommand.NOTIFICATION_PAYMENTS;
                        break;
                    case 'pictures':
                        cmd = JobQueueCommand.NOTIFICATION_PICTURES;
                        break;
                    case 'messages':
                        cmd = JobQueueCommand.NOTIFICATION_MESSAGES;
                        break;
                    case 'shipments':
                        cmd = JobQueueCommand.NOTIFICATION_SHIPMENTS;
                        break;
                    case 'quotations':
                        cmd = JobQueueCommand.NOTIFICATION_QUOTATIONS;
                        break;
                    case 'invoices':
                        cmd = JobQueueCommand.NOTIFICATION_INVOICES;
                        break;
                    case 'claims':
                        cmd = JobQueueCommand.NOTIFICATION_CLAIMS;
                        break;
                    case 'item competition':
                        cmd = JobQueueCommand.NOTIFICATION_ITEM_COMPETITION;
                        break;
                    default:
                        this.logger.error(`Llego una notificacion con topico desconocido ${notification.topic} - ${JSON.stringify(notification)}`);
                        return {result: 'No OK'};
                }
                const job: JobQueueInterface<NotificationInterface> = {
                    item: notification,
                    command: cmd
                };
                // meto el job en la cola de CENTRAL para que se procese
                await this.queue.add(process.env.NOTIFICATION_JOB, job);
                return {result: 'OK'};
            } else {
                this.logger.error(`Llego notificacion con application_id desconocida ${notification.application_id}`);
                return {result: 'No OK'};
            }
        } catch (err) {
            this.logger.error(`Ocurrio un error al encolar la notificacion ${JSON.stringify(notification)}`, err);
            return {result: 'No OK'};
        }
    }
}
