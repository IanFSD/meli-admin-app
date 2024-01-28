import {Module} from '@nestjs/common';
import {MeliAuthService} from "./meli.auth.service";
import {MeliAuthController} from './meli.auth.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthModule} from "../auth/auth.module";
import {TokenEntity} from "../resources/entity/token.entity";
import {UserDataEntity} from "../resources/entity/user.data.entity";
import {MercadolibreConnectionModule} from "../mercadolibre.connection/mercadolibre.connection.module";

@Module({
    imports: [TypeOrmModule.forFeature([UserDataEntity, TokenEntity]),
        AuthModule,
        MercadolibreConnectionModule],
    providers: [MeliAuthService],
    controllers: [MeliAuthController],
})
export class MeliAuthModule {
}
