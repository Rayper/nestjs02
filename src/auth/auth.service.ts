import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import * as bcrypt from "bcrypt";

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

    public async hashPassword(password: string): Promise<string> {
        // 10 nya adalah ukuran tingkat security hash nya
        return await bcrypt.hash(password, 10);
    }
}
