import {Body, Controller, Post} from '@nestjs/common';
import {MeliNotificationService} from "./meli.notification.service";
import {ApiBody} from "@nestjs/swagger";
import {NotificationInterface} from "../resources/interface/notification.interface";

@Controller('api/meli/notification')
export class MeliNotificationController {
    constructor(private readonly service: MeliNotificationService) {
    }

    @Post()
    @ApiBody({required: true, type: Object})
    async saveNotificaction(@Body() notification: NotificationInterface) {
        return await this.service.saveNotification(notification);
    }
}
