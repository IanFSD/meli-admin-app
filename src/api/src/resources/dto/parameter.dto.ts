import {ApiProperty} from "@nestjs/swagger";
import {IsNumber} from "class-validator";

export class ParameterDto {
    @ApiProperty()
    @IsNumber()
    comisionClasica: number;

    @ApiProperty()
    @IsNumber()
    comisionPremium: number;

    @ApiProperty()
    @IsNumber()
    impuestosVarios: number;

    @ApiProperty()
    @IsNumber()
    gastosAdminsitrativos: number;

    @ApiProperty()
    @IsNumber()
    limiteCostoEnvio: number;
}

