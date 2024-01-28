import {Controller, UseGuards} from '@nestjs/common';
import {ApiBearerAuth} from '@nestjs/swagger';
import {UserService} from "./user.service";
import {JwtAuthGuard} from "../auth/guards/jwt.auth.guard";
import {Crud, CrudController} from "@nestjsx/crud";
import {UserEntity} from "../resources/entity/user.entity";
import {UserDto} from "../resources/dto/user.dto";

@Crud({
    model: {type: UserEntity, },
    query: {alwaysPaginate: true},
    dto: {create: UserDto, replace: UserDto, update: UserDto}
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/user')
export class UserController implements CrudController<UserEntity> {
    constructor(public readonly service: UserService) {
    }
}
