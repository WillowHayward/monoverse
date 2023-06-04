import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';

@Module({
    imports: [UsersModule],
    controllers: [ApiController],
    providers: [ApiService],
})
export class ApiModule {}
