import {Module} from '@nestjs/common';
import {MeliNotificationService} from './meli.notification.service';
import {MeliNotificationController} from './meli.notification.controller';
import {BullModule} from "@nestjs/bull";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "../resources/entity/user.entity";
import {QueueConfigurationService} from "../resources/queue/queue.configuration.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        BullModule.registerQueueAsync({
            name: process.env.REDIS_QUEUE,
            useClass: QueueConfigurationService
        })
    ],
    controllers: [MeliNotificationController],
    providers: [MeliNotificationService],
})
export class MeliNotificationModule {
}
