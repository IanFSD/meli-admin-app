import {Injectable, Logger} from "@nestjs/common";
import {TypeOrmModuleOptions, TypeOrmOptionsFactory} from "@nestjs/typeorm";
import {FeeEntity} from "../entity/fee.entity";
import {ItemEntity} from "../entity/item.entity";
import {ProductEntity} from "../entity/product.entity";
import {UserEntity} from "../entity/user.entity";
import {TokenEntity} from "../entity/token.entity";
import {ItemVariationEntity} from "../entity/item.variation.entity";
import {UserDataEntity} from "../entity/user.data.entity";
import {CotizacionDolarEntity} from "../entity/cotizacion.dolar.entity";
import {ProviderEntity} from "../entity/provider.entity";
import {ParameterEntity} from "../entity/parameter.entity";
import {ItemProductEntity} from "../entity/item.product.entity";

@Injectable()
export class DatabaseConfigurationService implements TypeOrmOptionsFactory {
    private logger: Logger;

    constructor() {
        this.logger = new Logger(this.constructor.name);
    }

    createTypeOrmOptions(connectionName?: string): TypeOrmModuleOptions {
        let logging: any;
        if (process.env.DB_LOGGING === "true") {
            logging = true;
        } else {
            logging = String(process.env.DB_LOGGING);
            if (logging.includes(",")) {
                logging = logging.split(",");
            }
        }
        const entities: any[] = [
            FeeEntity,
            ItemEntity,
            ProductEntity,
            UserEntity,
            TokenEntity,
            ItemVariationEntity,
            UserDataEntity,
            CotizacionDolarEntity,
            ProviderEntity,
            ParameterEntity,
            ItemProductEntity
        ];
        let ret;
        if (process.env.DATABASE_URL) {
            ret = {
                type: process.env.DB_DIALECT,
                url: process.env.DATABASE_URL,
                synchronize: (process.env.DB_SYNCHRONIZE === "true"),
                logging: logging,
                // logger: new DatabaseLogger(),
                maxQueryExecutionTime: Number(process.env.DB_MAXQUERYEXECUTIONTIME),
                name: connectionName,
                entities: entities,
                retryAttempts: 999999,
            };
        } else {
            ret = {
                type: process.env.DB_DIALECT,
                host: process.env.DB_HOST,
                port: Number(process.env.DB_PORT),
                username: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,
                synchronize: (process.env.DB_SYNCHRONIZE === "true"),
                logging: logging,
                // logger: new DatabaseLogger(),
                maxQueryExecutionTime: Number(process.env.DB_MAXQUERYEXECUTIONTIME),
                name: connectionName,
                entities: entities,
                retryAttempts: 999999,
            };
        }
        return ret;
    }
}
