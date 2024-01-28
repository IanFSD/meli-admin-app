import {Module} from '@nestjs/common';
import {ItemWorkerService} from './item.worker.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ItemEntity} from "../../resources/entity/item.entity";
import {ProductEntity} from "../../resources/entity/product.entity";
import {ItemVariationEntity} from "../../resources/entity/item.variation.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ItemEntity, ProductEntity, ItemVariationEntity])],
    providers: [ItemWorkerService],
    exports: [ItemWorkerService]
})
export class ItemWorkerModule {
}
