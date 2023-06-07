import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from '../api/api.module';
import { UsersService } from './users.service';
import { UserEntity } from '../entities';

@Global()
@Module({
    imports: [ApiModule, TypeOrmModule.forFeature([UserEntity])],
    providers: [UsersService],
    exports: [UsersService]
})
export class UsersModule {}
