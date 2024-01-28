import {IsEmail} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class UserDto {
    @ApiProperty()
    @IsEmail()
    readonly email?: string;
}

