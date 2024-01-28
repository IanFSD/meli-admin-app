import {Module} from '@nestjs/common';
import {ItemNotificationService} from "./item.notification.service";
import {ItemProcessModule} from "../../processes/item/item.process.module";

@Module({
    imports: [ItemProcessModule],
    providers: [ItemNotificationService],
    exports: [ItemNotificationService],
})
export class ItemNotificationModule {
}
