import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsOptional, IsString} from "class-validator";

export class LinkItemDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    item_id: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    product_id: string;
}

