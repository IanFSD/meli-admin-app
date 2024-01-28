import {Module} from '@nestjs/common';
import {BulkWorkerService} from './bulk.worker.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UpdateItemsModule} from "./update.items/update.items.module";
import {DownloadItemsModule} from './download.items/download.items.module';
import {UserEntity} from "../../resources/entity/user.entity";
import {MercadolibreConnectionModule} from "../../mercadolibre.connection/mercadolibre.connection.module";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]),
        MercadolibreConnectionModule,
        DownloadItemsModule,
        UpdateItemsModule],
    providers: [BulkWorkerService],
    exports: [BulkWorkerService],
})
export class BulkWorkerModule {
}
