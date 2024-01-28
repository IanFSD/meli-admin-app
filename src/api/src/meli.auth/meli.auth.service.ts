import {Injectable, Logger} from "@nestjs/common";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {Response} from 'express';
import {TokenEntity} from "../resources/entity/token.entity";
import {getTrace} from "../resources/utilities/utils";
import {TokenInterface} from "../resources/interface/token.interface";
import {UserDataEntity} from "../resources/entity/user.data.entity";
import {UserMeliDataInterface} from "../resources/interface/user.meli.data.interface";
import {MercadolibreConnectionService} from "../mercadolibre.connection/mercadolibre.connection.service";
import {getMeliAuthUrl, getMeliMyUser, getMeliToken} from "../mercadolibre.connection/meli.utils";

/***
 * MeliAuthService se encarga de la autenticación contra ML.
 * Una vez activado, no se debería que volver a hacer.
 */
@Injectable()
export class MeliAuthService {
    private logger: Logger;

    constructor(@InjectRepository(UserDataEntity) private readonly repoUserData: Repository<UserDataEntity>,
                @InjectRepository(TokenEntity) private readonly repoToken: Repository<TokenEntity>,
                private readonly mercadolibreConnectionService: MercadolibreConnectionService) {
        this.logger = new Logger(this.constructor.name);
    }

    async link() {
        const authUrl: string = await getMeliAuthUrl();
        this.logger.debug(`devuelvo URL de activacion de MELI: ${authUrl}`);
        return {url: authUrl}
    }

    async authClient(code: string, error: string, errorDescription: string, state: string, response: Response) {
        try {
            this.logger.debug(`proceso respuesta auth de MELI: code=${code}, error=${error}, error description=${errorDescription}, state=${state}`);
            if (error) {
                this.logger.debug(`Vino error`);
                this.logger.debug(`redirijo a pagina de error de registracion`);
                return response.redirect(process.env.REDIRECT_WEB_REGISTRATION_ERROR);
            } else {
                return this.saveMercadoLibreData(code, response);
            }
        } catch (err) {
            this.logger.error(`Error al autenticar usuario de MELI con code=${code}, error=${error}, error description=${errorDescription}, state=${state}`, getTrace(err));
            return response.redirect(process.env.REDIRECT_WEB_REGISTRATION_ERROR);
        }
    }

    async state() {
        return this.mercadolibreConnectionService.get(`/users/me`)
    }

    private async saveMercadoLibreData(code: string, response: Response) {
        try {
            const tokenMeli: TokenInterface = await getMeliToken(code),
                userData: UserMeliDataInterface = await getMeliMyUser(tokenMeli.access_token),
                user = await this.repoUserData.findOne({where: {id: userData.id}})
            if (!user) {
                await this.repoUserData.insert( {user_id: tokenMeli.user_id, json: userData});
            } else {
                await this.repoUserData.update(1, {user_id: tokenMeli.user_id, json: userData});
            }
            // actualizo el token
            await this.mercadolibreConnectionService.saveToken(tokenMeli);
            // redirijo a pagina web
            return response.redirect(process.env.WEB_REDIRECT_URL);
        } catch (err) {
            this.logger.error(`Error al registrar el usuario ya registrado con MELI`, getTrace(err));
            return response.redirect(process.env.REDIRECT_MELI_REGISTRATION_ERROR);
        }
    }
}
