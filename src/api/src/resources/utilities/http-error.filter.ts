import {ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger,} from '@nestjs/common';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
    private logger: Logger;

    constructor() {
        this.logger = new Logger(this.constructor.name);
    }

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        this.logger.error(status);
        this.logger.error(request.url);
        this.logger.error(exception.message);
        this.logger.error(exception.stack);

        const errorResponse = {
            code: status,
            timestamp: new Date().toLocaleDateString(),
            path: request.url,
            method: request.method,
            message: status !== HttpStatus.INTERNAL_SERVER_ERROR
                // @ts-ignore
                ? exception.message.error || exception.message || null
                : 'Internal server error',
        };

        if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
            this.logger.error(`${request.method} ${request.url}`, exception.stack);
        } else {
            this.logger.error(`${request.method} ${request.url}`, JSON.stringify(errorResponse));
        }

        response.status(status).json(errorResponse);
    }
}
