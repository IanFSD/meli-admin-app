import {Injectable, Logger} from "@nestjs/common";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {Mutex} from 'async-mutex';
import {API_ROOT_URL, convertObjectToQueryString, getMeliRefreshToken} from "./meli.utils";
import {TokenEntity} from "../resources/entity/token.entity";
import api from "../resources/utilities/axios.instance";
import {getTrace} from "../resources/utilities/utils";
import {TokenInterface} from "../resources/interface/token.interface";

export const CONVERSATION_BLOCKED = 'conversation_blocked';
export const GET = 'GET';
export const POST = 'POST';
export const PUT = 'PUT';
export const PATCH = 'PATCH';
export const DELETE = 'DELETE';

@Injectable()
export class MercadolibreConnectionService {
    private mutex: Mutex;
    private logger: Logger;
    private token: TokenEntity;

    constructor(@InjectRepository(TokenEntity) private readonly repoToken: Repository<TokenEntity>) {
        this.logger = new Logger(this.constructor.name);
        this.mutex = new Mutex();
        this.checkToken()
    }

    get user_id() {
        return this.token.user_id
    }

    async get(path: string, params: any = undefined): Promise<any> {
        const query: string = convertObjectToQueryString(params ? params : {}),
            url = API_ROOT_URL + (path.charAt(0) == '/' ? '' : '/') + path + query;
        try {
            await this.checkToken()
            this.logMeli(GET, url);
            const res = await api.get(url, this.getMeliHeader());
            return res.data;
        } catch (err) {
            if (err.response.status === 401 || err.response.status === 403) {
                try {
                    this.logger.warn(`Error ${JSON.stringify(err.response.data)} en respuesta a get ${url}, hago refresh token y reintento`);
                    if (err.response.data && err.response.data.error === "not_owned_order") return null;
                    await this.refreshToken();
                    this.logger.debug(`Refresque el token, intento nuevamente`);
                    this.logMeli(GET, url);
                    const res = await api.get(url, this.getMeliHeader());
                    return res.data;
                } catch (err) {
                    this.logger.error(`Error en reintento de get ${url}`, getTrace(err));
                    throw err;
                }
            }
            this.logger.error(`Error en get ${url}`, getTrace(err));
            throw err;
        }
    }

    async post(path: string, body: any = {}, params: any = undefined): Promise<any> {
        const query: string = convertObjectToQueryString(params ? params : {}),
            url = API_ROOT_URL + (path.charAt(0) == '/' ? '' : '/') + path + query;
        try {
            await this.checkToken()
            this.logMeli(POST, url, body);
            const res = await api.post(url, body, this.getMeliHeader());
            return res.data;
        } catch (err) {
            if (err.response.status === 401 || err.response.status === 403 || err.response.status === 409) {
                try {
                    // INFO: esto es para atrapar el error que da al querer enviar un mensaje y la compra
                    // esta bloqueada por mediacion
                    if (err.response.data.status === 403 && err.response.data.error === CONVERSATION_BLOCKED) {
                        return err.response
                    }
                    if (err.response.data.status === 409) {
                        return err.response;
                    }
                    this.logger.warn(`Error ${JSON.stringify(err.response.data)} en respuesta a post ${url}, hago refresh token y reintento`);
                    if (err.response.data && err.response.data.error === "not_owned_order") return null;
                    await this.refreshToken();
                    this.logger.debug(`Refresque el token, intento nuevamente`);
                    this.logMeli(POST, url, body);
                    const res = await api.post(url, body, this.getMeliHeader());
                    return res.data;
                } catch (err) {
                    this.logger.error(`Error en reintento de post ${url} con ${JSON.stringify(body)}`, getTrace(err));
                    throw err;
                }
            }
            this.logger.error(`Error en post ${url} con ${JSON.stringify(body)}`, getTrace(err));
            throw err;
        }
    }

    async put(path: string, body: any = {}, params: any = undefined): Promise<any> {
        const query: string = convertObjectToQueryString(params ? params : {}),
            url = API_ROOT_URL + (path.charAt(0) == '/' ? '' : '/') + path + query;
        try {
            await this.checkToken()
            this.logMeli(PUT, url, body);
            const res = await api.put(url, body, this.getMeliHeader());
            return res.data;
        } catch (err) {
            if (err.response.status === 401 || err.response.status === 403) {
                try {
                    this.logger.warn(`Error ${JSON.stringify(err.response.data)} en respuesta a put ${url}, hago refresh token y reintento`);
                    if (err.response.data && err.response.data.error === "not_owned_order") return null;
                    await this.refreshToken();
                    this.logger.debug(`Refresque el token, intento nuevamente`);
                    this.logMeli(PUT, url, body);
                    const res = await api.put(url, body, this.getMeliHeader());
                    return res.data;
                } catch (err) {
                    this.logger.error(`Error en reintento de put ${url} con ${JSON.stringify(body)}`, getTrace(err));
                    throw err;
                }
            }
            this.logger.error(`Error en put ${url} con ${JSON.stringify(body)}`, getTrace(err));
            throw err;
        }
    }

    async patch(path: string, body: any = {}, params: any = undefined): Promise<any> {
        const query: string = convertObjectToQueryString(params ? params : {}),
            url = API_ROOT_URL + (path.charAt(0) == '/' ? '' : '/') + path + query;
        try {
            await this.checkToken()
            this.logMeli(PATCH, url, body);
            const res = await api.patch(url, body, this.getMeliHeader());
            return res.data;
        } catch (err) {
            if (err.response.status === 401 || err.response.status === 403) {
                try {
                    this.logger.warn(`Error ${JSON.stringify(err.response.data)} en respuesta a patch ${url}, hago refresh token y reintento`);
                    if (err.response.data && err.response.data.error === "not_owned_order") return null;
                    await this.refreshToken();
                    this.logger.debug(`Refresque el token, intento nuevamente`);
                    this.logMeli(PATCH, url, body);
                    const res = await api.patch(url, body, this.getMeliHeader());
                    return res.data;
                } catch (err) {
                    this.logger.error(`Error en reintento de patch ${url} con ${JSON.stringify(body)}`, getTrace(err));
                    throw err;
                }
            }
            this.logger.error(`Error en patch ${url} con ${JSON.stringify(body)}`, getTrace(err));
            throw err;
        }
    }

    async delete(path: string, params: any = undefined): Promise<any> {
        const query: string = convertObjectToQueryString(params ? params : {}),
            url = API_ROOT_URL + (path.charAt(0) == '/' ? '' : '/') + path + query;
        try {
            await this.checkToken()
            this.logMeli(DELETE, url);
            const res = await api.delete(url, this.getMeliHeader());
            return res.data;
        } catch (err) {
            if (err.response.status === 401 || err.response.status === 403) {
                try {
                    this.logger.warn(`Error ${JSON.stringify(err.response.data)} en respuesta a delete ${url}, hago refresh token y reintento`);
                    if (err.response.data && err.response.data.error === "not_owned_order") return null;
                    await this.refreshToken();
                    this.logger.debug(`Refresque el token, intento nuevamente`);
                    this.logMeli(DELETE, url);
                    const res = await api.delete(url, this.getMeliHeader());
                    return res.data;
                } catch (err) {
                    this.logger.error(`Error en reintento de delete ${url}`, getTrace(err));
                    throw err;
                }
            }
            this.logger.error(`Error en delete ${url}`, getTrace(err));
            throw err;
        }
    }

    async saveToken(newToken: TokenInterface) {
        return this.mutex.runExclusive(async () => {
            // genero el token
            const date = new Date();
            date.setSeconds(date.getSeconds() + newToken.expires_in - 3600);
            const token: TokenInterface = {
                access_token: newToken.access_token,
                expires_in: newToken.expires_in,
                refresh_token: newToken.refresh_token,
                scope: newToken.scope,
                token_type: newToken.token_type,
                user_id: newToken.user_id,
                expires_date: date
            };
            // veo si hay que agregar o actualizar
            const currentToken = await this.repoToken.findOne({where:{}});
            if (currentToken) {
                this.logger.debug(`Grabo el token del usuario ${newToken.user_id}`);
                return await this.repoToken.update(1, token);
            } else {
                this.logger.debug(`Grabo el token del usuario ${newToken.user_id}`);
                return await this.repoToken.insert(token);
            }
        }).catch((err) => {
            this.logger.error(`Error al obtener un token valido ${JSON.stringify(newToken)}`, getTrace(err));
            return null;
        })
    }

    private async checkToken() {
        if (!this.token) {
            try {
                this.token = await this.repoToken.findOne({where:{}})
            } catch (e) {
                this.logger.error('Ocurrio un error las leer el token de la base de datos', getTrace(e))
            }
        }
    }

    private getMeliHeader() {
        if (this.token && this.token.access_token) {
            return {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.token.access_token}`
                }
            }
        } else {
            return {headers: {"Content-Type": "application/json"}}
        }
    }

    private logMeli(method: string, url: string, body: any = null) {
        if (process.env.MELID_DEBUG === 'true') {
            const bodyStr = (body === undefined || body === null) ? '' : `--data '${JSON.stringify(body)}'`;
            this.logger.debug(`curl -X ${method} -H "Authorization: Bearer ${this.token.access_token}" ${url} ${bodyStr}`);
        }
    }

    private async refreshToken() {
        try {
            const res = await this.getValidToken(this.token, true);
            this.token = res;
            return res;
        } catch (err) {
            this.logger.error(`Error al obtener un toke valido`, getTrace(err));
            return null;
        }
    }

    private async getValidToken(userToken: TokenEntity, forceRefresh = false): Promise<TokenEntity> {
        return this.mutex.runExclusive(async () => {
            // valido la fecha de exipracion
            if (userToken.expires_date < new Date() || forceRefresh) {
                this.logger.debug(`El token está expirado, busco uno nuevo por refresh token`);
                const res = await getMeliRefreshToken(userToken.refresh_token),
                    date = new Date();
                date.setSeconds(date.getSeconds() + res.expires_in);
                const tokenDB: any = {
                    access_token: res.access_token,
                    expires_in: res.expires_in,
                    refresh_token: res.refresh_token,
                    scope: res.scope,
                    token_type: res.token_type,
                    user_id: res.user_id,
                    expires_date: date,
                };
                this.logger.debug(`Grabo el nuevo token`);
                await this.repoToken.update({user_id: res.user_id}, tokenDB);
                return tokenDB;
            } else {
                return userToken;
            }
        }).catch((err) => {
            this.logger.error(`Error al obtener un token valido ${JSON.stringify(userToken)}`, getTrace(err));
            return null;
        })
    }
}
