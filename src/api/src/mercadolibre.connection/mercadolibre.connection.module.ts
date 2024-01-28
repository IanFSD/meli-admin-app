import {Global, Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {MercadolibreConnectionService} from "./mercadolibre.connection.service";
import {TokenEntity} from "../resources/entity/token.entity";

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([TokenEntity])],
    providers: [MercadolibreConnectionService],
    exports: [TypeOrmModule.forFeature([TokenEntity]), MercadolibreConnectionService],
})
export class MercadolibreConnectionModule {
}
