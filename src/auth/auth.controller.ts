import { ClassSerializerInterceptor, Controller, Get, Post, Req, Request, SerializeOptions, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthGuardJwt } from './auth-guard.jwt';
import { AuthGuardLocal } from './auth-guard.local';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { User } from './user.entity';

@Controller('auth')
@SerializeOptions({strategy: 'excludeAll'})
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('login')
    // local adalah nama dari strategy yang telah dibuat
    @UseGuards(AuthGuardLocal)
    async login(@CurrentUser() user: User) {
        return {
            userId: user.id,
            token: this.authService.getTokenForUser(user)
        }
    }

    @Get('profile')
    // jwt adalah nama dari strategy yang telah dibuat
    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(AuthGuardJwt)
    async getProfile(@CurrentUser() user: User) {
        return user;
    }
}
