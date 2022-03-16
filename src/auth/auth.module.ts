import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LocalStrategy } from "./local.strategy";
import { User } from "./user.entity";
import { AuthController } from './auth.controller';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [LocalStrategy],
    controllers: [AuthController]
})
export class AuthModule {}