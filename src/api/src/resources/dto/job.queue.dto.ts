import {IsEnum, IsNotEmpty, IsObject, IsString} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';
import {JobQueueCommand} from "../interface/job.queue.interface";

export class JobQueueDto<T> {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    user_id: string;

    @ApiProperty()
    @IsObject()
    item: T;

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(JobQueueCommand)
    command: JobQueueCommand;
}
