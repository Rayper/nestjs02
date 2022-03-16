import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtservice: JwtService,
    ) {}

    public getTokenForUser(user: User): string {
        return this.jwtservice.sign({
            username: user.username,
            sub: user.id
        })
    }
}
