import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';

@Module({
    controllers: [ApiController, UsersModule],
    providers: [ApiService],
})
export class ApiModule {}
