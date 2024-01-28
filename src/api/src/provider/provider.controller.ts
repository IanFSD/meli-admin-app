import { Controller, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { ProviderService } from "./provider.service";
import { JwtAuthGuard } from "../auth/guards/jwt.auth.guard";
import { Crud, CrudController } from "@nestjsx/crud";
import { ProviderEntity } from "../resources/entity/provider.entity";

@Crud({
  model: {type: ProviderEntity, },
  query: {alwaysPaginate: true},
  //dto: {create: UserDto, replace: UserDto, update: UserDto}
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("api/provider")
export class ProviderController implements CrudController<ProviderEntity> {
  constructor(public readonly service: ProviderService) {}
}
