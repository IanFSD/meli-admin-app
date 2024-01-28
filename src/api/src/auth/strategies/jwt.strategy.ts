import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {ConfigService} from "@nestjs/config";
import {JwtPayload} from "../../resources/interface/jwt.payload.interface";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../../resources/entity/user.entity";
import {Repository} from "typeorm";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(@InjectRepository(UserEntity) private readonly repo: Repository<UserEntity>,
                private config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: config.get<string>('JWT_SECRET'),
            expiresIn: config.get<string>('JWT_EXPIRES_IN'),
            issuer: config.get<string>('JWT_ISSUER')
        });
    }

    async validate(payload: JwtPayload) {
        try {
            // await this.repo.findOneOrFail({where: {email: payload.email}})
            return payload;
        } catch (err) {
            throw new UnauthorizedException();
        }
    }
}
