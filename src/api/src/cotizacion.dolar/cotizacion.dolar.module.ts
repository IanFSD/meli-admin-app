import {Module} from '@nestjs/common';
import {CotizacionDolarService} from './cotizacion.dolar.service';
import {CotizacionDolarController} from './cotizacion.dolar.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {CotizacionDolarEntity} from "../resources/entity/cotizacion.dolar.entity";

@Module({
    imports: [TypeOrmModule.forFeature([CotizacionDolarEntity])],
    controllers: [CotizacionDolarController],
    providers: [CotizacionDolarService],
})
export class CotizacionDolarModule {
}
