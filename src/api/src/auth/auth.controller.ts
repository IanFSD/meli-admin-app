import {Controller, Get, Post, Req, Res, UseGuards} from '@nestjs/common';
import {Request,Response} from 'express';
import {AuthService} from "./auth.service";
import {JwtAuthGuard} from "./guards/jwt.auth.guard";
import {GoogleAuthGuard} from "./guards/google.auth.guard";

@Controller('api/auth')
export class AuthController {
    constructor(private readonly service: AuthService) {
    }

    @Get('login')
    @UseGuards(GoogleAuthGuard)
    login(@Req() req: Request, @Res() res: Response) {
    }

    @Get('callback')
    @UseGuards(GoogleAuthGuard)
    callbackGoogle(@Req() req: Request, @Res() res: Response) {
        if (!req.user) {
            return 'No user from google'
        }
        return this.service.callbackGoogle(req, res);
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    profile(@Req() req: Request): Promise<any> {
        return this.service.profile(req);
    }

    @Post('refreshtoken')
    @UseGuards(JwtAuthGuard)
    refreshToken(@Req() req: any): Promise<any> {
        return this.service.refreshToken(req);
    }
}
