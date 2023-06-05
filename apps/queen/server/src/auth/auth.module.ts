import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from '../api/api.module';
import { Session } from '../entities';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    imports: [HttpModule, ApiModule, TypeOrmModule.forFeature([Session])],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
