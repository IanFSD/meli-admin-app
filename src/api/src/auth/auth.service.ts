import {Injectable, Logger} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../resources/entity/user.entity";
// import passport from "passport";
// import {Request, Response} from "express";

/**
 * AuthService se encarga de autenticar ClientUser por username/password y setear el JWT
 */
@Injectable()
export class AuthService {
    private logger: Logger;

    constructor(private readonly jwtService: JwtService,
                @InjectRepository(UserEntity) private readonly repo: Repository<UserEntity>) {
        this.logger = new Logger(this.constructor.name);
    }

    //
    // async validateUser(email: string, password: string): Promise<any> {
    //     try {
    //         this.logger.debug(`valido el usuario ${email}`);
    //         const user: UserEntity = await this.repo.findOne({
    //             where: {
    //                 active: true,
    //                 state: UserStateEnum.ACTIVATED,
    //                 email: email
    //             }
    //         });
    //         if (user) {
    //             this.logger.debug(`valido la password del usuario ${email}`);
    //             if (comparePassword(password, user.password, user.salt)) {
    //                 this.logger.debug(`password valida`);
    //                 return {
    //                     first_name: user.first_name,
    //                     last_name: user.last_name,
    //                     email: user.email,
    //                     user_id: user.user_id,
    //                 };
    //             } else {
    //                 this.logger.error(`password invalida`);
    //                 return null;
    //             }
    //         } else {
    //             this.logger.error(`No exite user con email ${email}`);
    //             return null;
    //         }
    //     } catch (err) {
    //         this.logger.error(`Error al validar usuario con email ${email}`, getTrace(err));
    //         return null;
    //     }
    // }
    //
    // async validateUserById(user_id: string): Promise<any> {
    //     try {
    //         this.logger.debug(`valido el usuario ${user_id}`);
    //         const user: UserEntity = await this.repo.findOne({
    //             where: {
    //                 active: true,
    //                 state: UserStateEnum.ACTIVATED,
    //                 user_id: user_id
    //             }
    //         });
    //         if (user) {
    //             this.logger.debug(`usuario ${user_id} valido`);
    //             return {
    //                 first_name: user.first_name,
    //                 last_name: user.last_name,
    //                 email: user.email,
    //                 user_id: user.user_id
    //             };
    //         } else {
    //             this.logger.error(`No exite user con id ${user_id}`);
    //             return null;
    //         }
    //     } catch (err) {
    //         this.logger.error(`Error al validar usuario con email ${user_id}`, getTrace(err));
    //         return null;
    //     }
    // }
    //
    // async loginWithUserPassword(data: LoginDto, ip: string) {
    //     try {
    //         if (await validateRecaptcha(data.token, ip)) {
    //             // valido el usuario activo y registrado
    //             const user = await this.validateUser(data.email, data.password);
    //             if (!user) {
    //                 // valido si falta activacion en meli
    //                 const user = await this.userMissingActivation(data.email, data.password);
    //                 if (user) {
    //                     // esta registrado pero no activado, lo envio a activarse
    //                     const buff = Buffer.from(JSON.stringify(user.email));
    //                     const state = buff.toString('base64');
    //                     const authUrl: string = await getMeliAuthUrl(ip, this.config, state);
    //                     throw new HttpException({
    //                         status: HttpStatus.FORBIDDEN,
    //                         error: {redirect: authUrl},
    //                     }, HttpStatus.FORBIDDEN);
    //
    //                 }
    //                 throw new UnauthorizedException();
    //             }
    //             return {access_token: this.createtoken(user)};
    //         } else {
    //             this.logger.error(`Recaptcha invalido`);
    //             throw new UnauthorizedException();
    //         }
    //     } catch (err) {
    //         if (err instanceof UnauthorizedException || err instanceof HttpException) throw err;
    //         this.logger.error(`Error al loguear el usuario ${data.email}`, getTrace(err));
    //         throw new InternalServerErrorException();
    //     }
    // }
    //
    // async loginWithMeli(data: RecaptchaTokenDto, ip: string) {
    //     try {
    //         if (await validateRecaptcha(data.token, ip)) {
    //             const state = 'LoginWithMeli',
    //                 url = await getMeliAuthUrl(ip, this.config, state);
    //             return {url};
    //         } else {
    //             this.logger.error(`Recaptcha invalido`);
    //             throw new UnauthorizedException();
    //         }
    //     } catch (err) {
    //         if (err instanceof UnauthorizedException) throw err;
    //         this.logger.error(`Error al loguear el usuario por Meli`, getTrace(err));
    //         throw new InternalServerErrorException();
    //     }
    // }
    //
    // user(user: JwtPayload) {
    //     return {user};
    // }
    //
    // createtoken(user: JwtPayload): string {
    //     return this.jwtService.sign(user);
    // }
    //
    // private async userMissingActivation(email: string, password: string) {
    //     try {
    //         this.logger.debug(`valido el usuario ${email}`);
    //         const user: UserEntity = await this.repo.findOne({
    //             where: {
    //                 active: false,
    //                 state: UserStateEnum.REGISTERED,
    //                 email: email
    //             }
    //         });
    //         if (user) {
    //             this.logger.debug(`valido la password del usuario ${email}`);
    //             if (comparePassword(password, user.password, user.salt)) {
    //                 this.logger.debug(`password valida`);
    //                 return {
    //                     first_name: user.first_name,
    //                     last_name: user.last_name,
    //                     email: user.email,
    //                     user_id: user.user_id,
    //                 };
    //             } else {
    //                 this.logger.error(`password invalida`);
    //                 return null;
    //             }
    //         } else {
    //             this.logger.error(`No exite user con email ${email}`);
    //             return null;
    //         }
    //     } catch (err) {
    //         this.logger.error(`Error al validar usuario con email ${email}`, getTrace(err));
    //         return null;
    //     }
    // }


    callbackGoogle(req: any, res: any) {
        const token = this.createtoken(req.user);
        const url = `${process.env.WEB_REDIRECT_URL}?access_token=${token}&state=${req.query.state}`;
        res.redirect(url);
    }

    refreshToken(req: any): any {
        const token = req.headers.authorization.split(' ')[1];
        const decode = this.jwtService.decode(token);
        return this.createtoken(decode);
    }

    createtoken(token): any {
        return this.jwtService.sign(token);
    }

    profile(req): Promise<any> {
        return req.user;
    }
}
