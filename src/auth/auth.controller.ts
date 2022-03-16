import { Controller, Get, Post, Req, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('login')
    // local adalah nama dari strategy yang telah dibuat
    @UseGuards(AuthGuard('local'))
    async login(@Request() request) {
        return {
            userId: request.user.id,
            token: this.authService.getTokenForUser(request.user)
        }
    }

    @Get('profile')
    // jwt adalah nama dari strategy yang telah dibuat
    @UseGuards(AuthGuard('jwt'))
    async getProfile(@Request() request) {
        return request.user;
    }
}
