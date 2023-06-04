import { Module, Global } from '@nestjs/common';
import { ApiModule } from '../api/api.module';
import { UsersService } from './users.service';

@Global()
@Module({
    imports: [ApiModule],
    providers: [UsersService],
    exports: [UsersService]
})
export class UsersModule {}
