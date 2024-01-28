import {MiddlewareConsumer, Module, NestModule, RequestMethod,} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {AuthModule} from "./auth/auth.module";
import {UserModule} from "./user/user.module";
import {ItemModule} from "./item/item.module";
import {ProductModule} from "./product/product.module";
import {MeliAuthModule} from "./meli.auth/meli.auth.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ServeStaticModule} from "@nestjs/serve-static";
import {join} from "path";
import {MeliNotificationModule} from "./meli.notificaction/meli.notification.module";
import {DatabaseConfigurationService} from "./resources/database/database.configuration.service";
import {LoggerMiddleware} from "./resources/utilities/logger.middleware";
import {SendEmailModule} from "./send.email/send.email.module";
import {CotizacionDolarModule} from "./cotizacion.dolar/cotizacion.dolar.module";
import {ProviderModule} from "./provider/provider.module";
import {ParameterModule} from "./parameter/parameter.module";
import {MercadolibreConnectionModule} from "./mercadolibre.connection/mercadolibre.connection.module";
import {NotificationWorkerModule} from "./worker/notification.worker/notification.worker.module";
import {BulkWorkerModule} from "./worker/bulk.worker/bulk.worker.module";
import {ItemWorkerModule} from "./worker/item.worker/item.worker.module";
import {QueueConfigurationService} from "./resources/queue/queue.configuration.service";
import {BullModule} from "@nestjs/bull";
import {ArenaModule} from "./arena/arena.module";
import {MulterModule} from "@nestjs/platform-express";

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        TypeOrmModule.forRootAsync({useClass: DatabaseConfigurationService}),
        BullModule.registerQueueAsync({
            name: process.env.REDIS_QUEUE,
            useClass: QueueConfigurationService
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, "..", "..", "..", "web", "web-client", "dist"),
            renderPath: "/",
        }),
        MulterModule.register({dest: process.env.MULTER_PATH}),
        MercadolibreConnectionModule,
        AuthModule,
        UserModule,
        ProductModule,
        ProviderModule,
        ItemModule,
        MeliAuthModule,
        MeliNotificationModule,
        SendEmailModule,
        CotizacionDolarModule,
        ParameterModule,
        NotificationWorkerModule,
        BulkWorkerModule,
        ItemWorkerModule,
        ArenaModule
    ],
})
export class ApplicationModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggerMiddleware)
            .forRoutes({path: "*", method: RequestMethod.ALL});
    }
}
