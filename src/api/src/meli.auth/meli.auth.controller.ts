import {Controller, Get, Query, Res, UseGuards} from '@nestjs/common';
import {MeliAuthService} from "./meli.auth.service";
import {Response} from "express";
import {ApiBearerAuth} from "@nestjs/swagger";
import {JwtAuthGuard} from "../auth/guards/jwt.auth.guard";

@ApiBearerAuth()
@Controller('api/meli')
export class MeliAuthController {
    constructor(public readonly service: MeliAuthService) {
    }

    @UseGuards(JwtAuthGuard)
    @Get('state')
    state() {
        return this.service.state();
    }

    @UseGuards(JwtAuthGuard)
    @Get('link')
    link() {
        return this.service.link();
    }

    @Get('auth')
    authClient(@Query('code') code: string,
               @Query('error') error: string,
               @Query('error_description') errorDescription: string,
               @Query('state') state: string,
               @Res() response: Response) {
        return this.service.authClient(code, error, errorDescription, state, response);
    }
}
