import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {DownloadItemsService} from './download.items.service';
import {ProductEntity} from "../../../resources/entity/product.entity";
import {ItemEntity} from "../../../resources/entity/item.entity";
import {ItemProcessModule} from "../../processes/item/item.process.module";

@Module({
    imports: [TypeOrmModule.forFeature([ProductEntity, ItemEntity]), ItemProcessModule],
    providers: [DownloadItemsService],
    exports: [DownloadItemsService],
})
export class DownloadItemsModule {
}
