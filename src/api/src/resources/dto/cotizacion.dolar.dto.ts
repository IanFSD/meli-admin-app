import {ApiProperty} from "@nestjs/swagger";
import {IsDate, IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";

export class CotizacionDolarDto {
    @ApiProperty()
    @IsNumber()
    cotizacion: number;

    @ApiProperty()
    @IsDate()
    @Type(() => Date)
    fecha: Date;
}
