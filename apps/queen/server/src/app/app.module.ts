import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { ApiModule } from '../api/api.module';

@Module({
    imports: [AuthModule, ApiModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
