import {Module} from '@nestjs/common';
import {OrderNotificationService} from "./order.notification.service";
import {MercadolibreConnectionModule} from "../../../mercadolibre.connection/mercadolibre.connection.module";

@Module({
    imports: [MercadolibreConnectionModule],
    providers: [OrderNotificationService],
    exports: [OrderNotificationService],
})
export class OrderNotificationModule {
}
