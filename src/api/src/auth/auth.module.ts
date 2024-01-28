import {Module} from '@nestjs/common';
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from "@nestjs/jwt";
import {ConfigService} from '@nestjs/config';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "../resources/entity/user.entity";
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {JwtStrategy} from "./strategies/jwt.strategy";
import {GoogleStrategy} from "./strategies/google.strategy";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        PassportModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            imports: [ConfigService],
            useFactory: async (config: ConfigService) => ({
                secret: config.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: config.get<string>('JWT_EXPIRES_IN'),
                    issuer: config.get<string>('JWT_ISSUER'),
                },
            })
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, GoogleStrategy],
    exports: [AuthService]
})
export class AuthModule {
}

