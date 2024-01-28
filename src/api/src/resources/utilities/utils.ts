import api from "./axios.instance";
import crypto = require('crypto');

export function generateSalt(): string {
    return crypto.randomBytes(16).toString('hex');
}

export function hashPassword(password: string, salt: string): string {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
}

export function comparePassword(password: string, hashedPassword: string, salt: string): boolean {
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
    return hashedPassword === hash;
}

export function emptyPromise(val: any = null): Promise<any> {
    return new Promise((resolve) => {
        resolve(val);
    });
}

export function formatDate(strDate: string | number | Date) {
    if (strDate) {
        const now = new Date(strDate);
        if (now) {
            const year = '' + now.getFullYear();
            let month = '' + (now.getMonth() + 1);
            if (month.length === 1) {
                month = '0' + month;
            }
            let day = '' + now.getDate();
            if (day.length === 1) {
                day = '0' + day;
            }
            return year + '-' + month + '-' + day;
        }
    } else {
        return '';
    }
}

export function formatDateTime(strDate: string | number | Date) {

    if (strDate) {
        const now = new Date(strDate);
        if (now) {
            const year = '' + now.getFullYear();
            let month = '' + (now.getMonth() + 1);
            if (month.length === 1) {
                month = '0' + month;
            }
            let day = '' + now.getDate();
            if (day.length === 1) {
                day = '0' + day;
            }
            let hour = '' + now.getHours();
            if (hour.length === 1) {
                hour = '0' + hour;
            }
            let minute = '' + now.getMinutes();
            if (minute.length === 1) {
                minute = '0' + minute;
            }
            let second = '' + now.getSeconds();
            if (second.length === 1) {
                second = '0' + second;
            }
            return day + '-' + month + '-' + year + ' ' + hour + ':' + minute + ':' + second;
        }
    } else {
        return '';
    }
}

function replaceAll(str, mapObj) {
    const re = new RegExp(Object.keys(mapObj).join("|"), "gi");
    return str.replace(re, function (matched) {
        return mapObj[matched.toLowerCase()];
    });
}

export async function validateRecaptcha(token: string, ip: string): Promise<boolean> {
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SERVERKEY}&response=${token}&remoteip=${ip}`;
    const res = await api.post(url);
    return res.data.success;
}

export function getTrace(err: any): any {
    for (const errKey in err) {
        console.log(errKey, err[errKey])
    }

    const ret: any = {message: err.message, stack: err.stack};
    if (err.response) {
        ret.data = err.response.data
    }
    return ret;
}

export function chunkArray(myArray: any[], chunk_size = 20) {
    // eslint-disable-next-line prefer-const
    const arrayLength = myArray.length,
        tempArray = [];
    for (let index = 0; index < arrayLength; index += chunk_size) {
        const myChunk = myArray.slice(index, index + chunk_size);
        // Do something if you want with the group
        tempArray.push(myChunk);
    }
    return tempArray;
}
