import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ApiModule } from '../api/api.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    imports: [HttpModule, ApiModule],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
