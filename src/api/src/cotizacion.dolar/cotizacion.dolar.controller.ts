import {Body, Controller, Get, Inject, Patch, Post, UseGuards} from '@nestjs/common';
import {CotizacionDolarService} from './cotizacion.dolar.service';
import {JwtAuthGuard} from "../auth/guards/jwt.auth.guard";
import {CotizacionDolarDto} from "../resources/dto/cotizacion.dolar.dto";
import {ApiBearerAuth} from "@nestjs/swagger";

@Controller('api/cotizaciondolar')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CotizacionDolarController {
    constructor(@Inject(CotizacionDolarService) private readonly service: CotizacionDolarService) {
    }

    @Get()
    GetCotizacionDolar() {
        return this.service.GetCotizacionDolar();
    }

    @Post()
    GrabarDolar(@Body() data: CotizacionDolarDto) {
        return this.service.GrabarDolar(data);
    }

    @Patch()
    UpdateCotizacionDolar() {
        return this.service.UpdateCotizacionDolar();
    }
}
