import {Job} from "bull";
import {Repository} from "typeorm";
import {Inject, Logger} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {MercadolibreConnectionService} from "../../../mercadolibre.connection/mercadolibre.connection.service";
import {chunkArray} from "../../../resources/utilities/utils";
import {ItemEntity} from "../../../resources/entity/item.entity";
import {ItemProcessService} from "../../processes/item/item.process.service";
import {JobQueueInterface} from "../../../resources/interface/job.queue.interface";
import {ItemInterface} from "../../../resources/interface/item.interface";

export class DownloadItemsService {
    private logger: Logger;

    constructor(@InjectRepository(ItemEntity) private readonly repoItem: Repository<ItemEntity>,
                @Inject(ItemProcessService) private readonly itemProcessService: ItemProcessService,
                @Inject(MercadolibreConnectionService) private readonly mercadolibreConnectionService: MercadolibreConnectionService) {
        this.logger = new Logger(this.constructor.name);
    }

    /**
     * Se bajan masivamente las publicaciones.
     * Primero se obtienen la lista de Id de las publicaciones.
     * Segundo se bajan de a bloques las publicaciones y se guardan en ClientMeliItem.
     */
    async process(job: Job): Promise<any> {
        const jobData: JobQueueInterface<any> = job.data,
            categories: any = {};
        const idList = await this.getItemIds();
        await this.processIds(idList, categories);
        await this.dowloadCategories(categories);
        return 'Items downloaded.';
    }

    // Obtengo la lista de id de publicaciones
    private async getItemIds(): Promise<string[]> {
        let idList: string[] = [],
            url = `users/${this.mercadolibreConnectionService.user_id}/items/search`;
        this.logger.debug(`Obtengo la lista de id de publicaciones`);
        let item = await this.mercadolibreConnectionService.get(url, {search_type: 'scan'});
        if (item.paging.total < item.paging.limit) {
            idList = idList.concat(item.results)
        } else {
            idList = idList.concat(item.results);
            let scroll_id = item.scroll_id;
            while (idList.length < item.paging.total) {
                url = `users/${this.mercadolibreConnectionService.user_id}/items/search`;
                item = await this.mercadolibreConnectionService.get(url, {search_type: 'scan', scroll_id: scroll_id});
                scroll_id = item.scroll_id;
                idList = idList.concat(item.results);
                this.logger.debug(`Ids leidos ${idList.length} de ${item.paging.total}`);
            }
        }
        return idList;
    }

    private async downloadItemsFromMeli(ids: string[], categories: any): Promise<any> {
        const url = `items`,
            items = await this.mercadolibreConnectionService.get(url, {ids: ids.join(',')});
        for (const item of items) {
            if (item.code === 200) {
                const meliItem: ItemInterface = item.body;
                await this.itemProcessService.processItem(meliItem);
                categories[meliItem.category_id] = null;
            } else {
                this.logger.error(`Llego un item con codigo distinto de 200 - ${JSON.stringify(item)}`)
            }
        }
    }

    private async processIds(idList: string[], categories: any): Promise<any> {
        // obtengo todas las publicaciones
        this.logger.debug(`Obtengo ${idList.length} publicaciones`);
        const chunks = chunkArray(idList);
        for (let i = 0; i < chunks.length; i++) {
            this.logger.debug(`Proceso ${i} de ${chunks.length} bloques`);
            await this.downloadItemsFromMeli(chunks[i], categories);
            await this.downloadShippingCost(chunks[i]);
        }
    }

    private async dowloadCategories(categories: any) {
        // let categoriasDB = await CategoriaModel.find().exec();
        // for (let i = 0; i < categorias.length; i++) {
        //     if (arrayFindByAttribute(categoriasDB, 'id', categorias[i]) === null) {
        //         let url = `categories/${categorias[i]}`;
        //         let item = await MeliApp.get(url);
        //         await updateOneWithRetry(CategoriaModel, {id: item.id}, item, true)
        //     }
        // }
    }

    private async downloadShippingCost(ids: string[]) {
        // let url = `/items/shipping_options/free`;
        // let items = await MeliApp.get(url, {ids: ids.join(',')}, 5, false);
        // for (let i = 0; i < Object.keys(items).length; i++) {
        //     let id = Object.keys(items)[i];
        //     await updateOneWithRetry(PublicacionModel, {id: id}, {costoEnvio: items[id].coverage}, false);
        // }
    }
}
