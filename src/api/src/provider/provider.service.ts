import {Injectable} from "@nestjs/common";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {ProviderEntity} from "../resources/entity/provider.entity";

/**
 * ProviderService se encarga de visualizar los Providero
 */
@Injectable()
export class ProviderService extends TypeOrmCrudService<ProviderEntity> {
    constructor(@InjectRepository(ProviderEntity) repo: Repository<ProviderEntity>) {
        super(repo);
    }
}
