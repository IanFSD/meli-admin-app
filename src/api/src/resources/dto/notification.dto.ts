import {ApiProperty} from "@nestjs/swagger";

export class NotificationDto {
    @ApiProperty()
     resource: string;

    @ApiProperty()
     user_id: string;

    @ApiProperty()
     topic: string;

    @ApiProperty()
     application_id: string;

    @ApiProperty()
     attempts: number;

    @ApiProperty()
     sent: Date;

    @ApiProperty()
     delivered: Date;
}

