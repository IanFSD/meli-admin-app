import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsOptional, IsString} from "class-validator";

export class LinkItemVariationDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    variation_id: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    product_id: string;
}

