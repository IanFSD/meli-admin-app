import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UserEntity} from "../resources/entity/user.entity";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm";

/**
 * UserService se encarga del CRUD de ClientUser
 */
@Injectable()
export class UserService extends TypeOrmCrudService<UserEntity> {
    constructor(@InjectRepository(UserEntity) repo: Repository<UserEntity>) {
        super(repo);
    }
}
