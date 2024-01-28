import {IsNotEmpty} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class AgentQueueDto {
    @ApiProperty()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    host: string;

    @ApiProperty()
    @IsNotEmpty()
    port: number;

    @ApiProperty()
    @IsNotEmpty()
    password: string;
}

