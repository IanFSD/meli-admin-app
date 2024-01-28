import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "../../resources/entity/user.entity";
import {NotificationWorkerService} from "./notification.worker.service";
import {ItemNotificationModule} from "./item.notification/item.notification.module";
import {OrderNotificationModule} from "./order.notification/order.notification.module";
import {UserDataEntity} from "../../resources/entity/user.data.entity";

@Module({
    imports: [TypeOrmModule.forFeature([UserDataEntity]),
        ItemNotificationModule,
        OrderNotificationModule],
    providers: [NotificationWorkerService],
    exports: [NotificationWorkerService],
})

export class NotificationWorkerModule {
}
