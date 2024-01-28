import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ProductEntity} from "../../../resources/entity/product.entity";
import {ItemEntity} from "../../../resources/entity/item.entity";
import {ItemWorkerModule} from "../../item.worker/item.worker.module";
import {UpdateItemsService} from "./update.items.service";

@Module({
    imports: [TypeOrmModule.forFeature([ProductEntity, ItemEntity]), ItemWorkerModule],
    providers: [UpdateItemsService],
    exports: [UpdateItemsService],
})
export class UpdateItemsModule {
}
