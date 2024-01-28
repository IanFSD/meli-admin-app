import {Logger} from "@nestjs/common";
import {TokenInterface} from "../resources/interface/token.interface";
import api from "../resources/utilities/axios.instance";
import {getTrace} from "../resources/utilities/utils";
import {UserMeliDataInterface} from "../resources/interface/user.meli.data.interface";

export const API_ROOT_URL = 'https://api.mercadolibre.com';
export const OAUTH_URL = 'https://api.mercadolibre.com/oauth/token';

const staticlogger: Logger = new Logger('MELI Utils');

export async function getMeliAuthUrl(state?: string): Promise<string> {
    // https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=$APP_ID
    return `${await getMeliAuthUrlBase()}?response_type=code&client_id=${process.env.MELI_APP_ID}${state ? '&state=' + state : ''}`;
}

export async function getMeliToken(code: string): Promise<TokenInterface> {
    // const url: string = `${OAUTH_URL}?grant_type=authorization_code&client_id=${process.env.MELI_APP_ID}&client_secret=${process.env.MELI_SECRET_KEY}&code=${code}&redirect_uri=${process.env.MELI_REDIRECT_URI}`;
    const url: string = OAUTH_URL,
        body = {
            grant_type: 'authorization_code',
            client_id: process.env.MELI_APP_ID,
            client_secret: process.env.MELI_SECRET_KEY,
            code,
            redirect_uri: process.env.MELI_REDIRECT_URI
        };
    // https://api.mercadolibre.com/oauth/token?grant_type=authorization_code&client_id=$APP_ID&client_secret=$SECRET_KEY&code=$SERVER_GENERATED_AUTHORIZATION_CODE&redirect_uri=$REDIRECT_URI
    try {
        const res = await api.post(url, body, {
            headers: {
                accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded'
            }
        });
        return res.data as TokenInterface;
    } catch (err) {
        staticlogger.error(`Error en get token ${url}`, getTrace(err));
        throw err;
    }
}

export async function getMeliRefreshToken(refresh_token: string): Promise<any> {
    // const url: string = `${OAUTH_URL}?grant_type=refresh_token&client_id=${process.env.MELI_APP_ID}&client_secret=${process.env.MELI_SECRET_KEY}&refresh_token=${refresh_token}`;
    // https://api.mercadolibre.com/oauth/token?grant_type=refresh_token&client_id=$APP_ID&client_secret=$SECRET_KEY&refresh_token=$REFRESH_TOKEN
    const url: string = OAUTH_URL,
        body = {
            grant_type: 'refresh_token',
            client_id: process.env.MELI_APP_ID,
            client_secret: process.env.MELI_SECRET_KEY,
            refresh_token: refresh_token
        };
    try {
        const res = await api.post(url, body, {
            headers: {
                accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded'
            }
        });
        return res.data;
    } catch (err) {
        staticlogger.error(`Error en refresh token ${url}`, getTrace(err));
        throw err;
    }
}

export async function getMeliAuthUrlBase() {
    return 'https://auth.mercadolibre.com.ar/authorization';
}

export async function getMeliMyUser(access_token: string): Promise<UserMeliDataInterface> {
    const url = `${API_ROOT_URL}/users/me`;
    try {
        const res = await api.get(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`
            }
        });
        return res.data;
    } catch (err) {
        staticlogger.error(`Error en get ${url}`, getTrace(err));
        throw err;
    }
}


export function convertObjectToQueryString(objOrig: any): string {
    const querystring = require('querystring');
    const obj = {...objOrig};
    // if (!obj.access_token && this.token && this.token.access_token) {
    //     obj.access_token = this.token.access_token;
    // }
    let result: string = querystring.stringify(obj);
    if (result.length > 0) {
        result = '?' + result;
    }
    return result;
}
