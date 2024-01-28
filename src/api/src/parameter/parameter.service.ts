import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {ParameterEntity} from "../resources/entity/parameter.entity";
import {ParameterDto} from "../resources/dto/parameter.dto";

/**
 * ParameterService se encarga de visualizar los Parametero
 */
@Injectable()
export class ParameterService {
    constructor(@InjectRepository(ParameterEntity) private readonly repo: Repository<ParameterEntity>) {
    }

    load() {
        return this.repo.findOne({where:{}})
    }

    async save(body: ParameterDto) {
        const ret = await this.load()
        if (ret) {
            return await this.repo.update(1, body)
        } else {
            return await this.repo.insert(body)
        }
    }
}
