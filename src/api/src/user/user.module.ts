import {Module} from '@nestjs/common';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthModule} from "../auth/auth.module";
import {UserEntity} from "../resources/entity/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), AuthModule],
    providers: [UserService],
    controllers: [UserController],
})
export class UserModule {
}
