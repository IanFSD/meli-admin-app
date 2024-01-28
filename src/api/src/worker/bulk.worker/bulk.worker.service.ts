import {Inject, Injectable, Logger} from '@nestjs/common';
import {Job} from 'bull';
import {Process, Processor} from "@nestjs/bull";
import {DownloadItemsService} from "./download.items/download.items.service";
import {UpdateItemsService} from "./update.items/update.items.service";
import {JobQueueCommand, JobQueueInterface} from "../../resources/interface/job.queue.interface";
import {getTrace} from "../../resources/utilities/utils";

/**
 * AdminMeliBulkService se encarga procesar los jobs que llegan a colas del tipo MELI_BULK.
 * El API cliente es quien crea jobs en este cola, al pedir una descarga masiva de publicaciones.
 * Se recibe el job y se procesa: se descargan masivamen publicacines de ML y se guardan en ClientMeliItem.
 */
@Injectable()
@Processor(process.env.REDIS_QUEUE)
export class BulkWorkerService {
    private logger: Logger;

    constructor(@Inject(DownloadItemsService) private readonly downloadItemsService: DownloadItemsService,
                @Inject(UpdateItemsService) private readonly updateItemsService: UpdateItemsService) {
        this.logger = new Logger(this.constructor.name);
    }

    // @Process(process.env.BULK_JOB)
    @Process('BULK')
    async processJob(job: Job): Promise<any> {
        this.logger.debug(`Processing job ${job.id} of type ${job.name} with data ${JSON.stringify(job.data)}`);
        const jobData: JobQueueInterface<any> = job.data;
        try {
            // Dependiendo del comando del job hago lo que corresponda
            switch (jobData.command) {
                case JobQueueCommand.ITEMS_DOWNLOAD:
                    return this.downloadItemsService.process(job);
                case JobQueueCommand.ITEMS_UPDATE:
                    return this.updateItemsService.process(job);
                default:
                    const errorMessage = `Llego un comando (${jobData.command}) desconocido`;
                    this.logger.error(errorMessage + `: ${JSON.stringify(jobData)}`);
                    job.log(errorMessage);
                    return {result: 'No OK'};
            }
        } catch (err) {
            this.logger.error(`Error al procesar el job ${job.id} con ${JSON.stringify(jobData)}`, getTrace(err));
            job.log(`Error al procesar el job: ${getTrace(err)}`);
            return {result: 'No OK'};
        }
    }
}
