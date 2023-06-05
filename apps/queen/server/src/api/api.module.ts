import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';

import { User, Session } from '../entities';

@Module({
    imports: [HttpModule, TypeOrmModule.forFeature([User, Session])],
    controllers: [ApiController],
    providers: [ApiService],
    exports: [ApiService]
})
export class ApiModule {}
