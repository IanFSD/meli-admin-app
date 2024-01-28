import {IsNotEmpty} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class RecaptchaTokenDto {
    @ApiProperty()
    @IsNotEmpty()
    readonly token: string;
}
