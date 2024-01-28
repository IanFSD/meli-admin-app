import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ItemProcessService} from "./item.process.service";
import {ItemEntity} from "../../../resources/entity/item.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ItemEntity])],
    providers: [ItemProcessService],
    exports: [ItemProcessService],
})
export class ItemProcessModule {
}
