import {NestFactory} from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {ApplicationModule} from './application.module';
import * as helmet from 'helmet';
import * as compression from 'compression';
import {ValidationPipe} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {ArenaService} from "./arena/arena.service";
// import { HttpErrorFilter } from './resources/utilities/http-error.filter';
// import * as winston from 'winston';
// import {utilities as nestWinstonModuleUtilities, WinstonModule} from 'nest-winston';

const globalPrefix = '/api';

// const logger = WinstonModule.createLogger({
//     transports: [new winston.transports.Console({
//         level: process.env.LOG_LEVEL || 'debug',
//         format: process.env.PRODUCTION ? winston.format.json() :
//             winston.format.combine(winston.format.timestamp(), nestWinstonModuleUtilities.format.nestLike())
//     })]
// });

async function bootstrap() {
    const app = await NestFactory.create(ApplicationModule, {/*logger: logger*/});
    // app.setGlobalPrefix(globalPrefix);
    app.useGlobalPipes(new ValidationPipe({transform: true, transformOptions: {enableImplicitConversion: true}}));
    // app.useGlobalFilters(new HttpErrorFilter());
    app.enableCors();
    app.use(helmet());
    app.use(compression());

    const config = app.get(ConfigService);

    const options = new DocumentBuilder()
        .setTitle('Integerp - Client - API')
        .setDescription('Integerp - Client - API')
        .setVersion('0.1')
        .addBearerAuth()
        .setContact('Integerp', 'https://www.integerp.net', 'julio.kriger@integerp.net')
        .addTag('Client API')
        // .setExternalDoc('json schema', `${globalPrefix}/swagger.json`)
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(`${globalPrefix}/api-docs`, app, document);

    app.use(`${globalPrefix}/swagger.json`, (req, res) => res.send(document));

    // const arena = app.get(ArenaService);
    // await arena.setupArena(app);
    // await arena.setupBoard(app);

    const port = config.get<string>('API_CLIENT_PORT') || 3000;

    await app.listen(port, '0.0.0.0').then(() => {
        return app.getUrl().then(res => {
            console.debug(`API Application is running on: ${res}`, 'Main');
        });
    });
}

bootstrap();
