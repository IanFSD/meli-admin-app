import {Body, Controller, Get, Post, UseGuards} from "@nestjs/common";
import {ApiBearerAuth} from "@nestjs/swagger";
import {ParameterService} from "./parameter.service";
import {JwtAuthGuard} from "../auth/guards/jwt.auth.guard";
import {ParameterDto} from "../resources/dto/parameter.dto";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("api/parameter")
export class ParameterController {
    constructor(public readonly service: ParameterService) {
    }

    @Get()
    load() {
        return this.service.load()
    }

    @Post()
    save(@Body() body: ParameterDto) {
        return this.service.save(body)
    }
}
