import {IsNotEmpty} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class FeeDto {
    @ApiProperty()
    @IsNotEmpty()
    listing_type_id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    threshold: number;

    @ApiProperty()
    percentage_above_threshold: number;

    @ApiProperty()
    fixed_value_per_item_above_threshold: number;

    @ApiProperty()
    percentage_below_threshold: number;

    @ApiProperty()
    fixed_value_per_item_below_threshold: number;
}

