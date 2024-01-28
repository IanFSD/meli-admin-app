import {Module} from '@nestjs/common';
import {ItemService} from './item.service';
import {ItemController} from './item.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ItemEntity} from "../resources/entity/item.entity";
import {BullModule} from "@nestjs/bull";
import {QueueConfigurationService} from "../resources/queue/queue.configuration.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([ItemEntity]),
        BullModule.registerQueueAsync({
            name: process.env.REDIS_QUEUE,
            useClass: QueueConfigurationService
        }),
    ],
    providers: [ItemService],
    controllers: [ItemController],
})
export class ItemModule {
}
