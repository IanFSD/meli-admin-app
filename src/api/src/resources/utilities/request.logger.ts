import {Injectable, Logger, NestMiddleware} from "@nestjs/common";
import {Request, Response} from 'express';

@Injectable()
export class RequestLogger implements NestMiddleware {
    private logger: Logger;

    constructor() {
        this.logger = new Logger(this.constructor.name);
    }

    use(req: Request, res: Response, next: Function) {
        const data: any = {method: req.method, host: req.hostname, url: req.baseUrl, query: req.query, body: req.body};
        this.logger.debug(`Request: ${JSON.stringify(data)}`);
        next();
    }
}
