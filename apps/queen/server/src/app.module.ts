import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthModule } from './auth/auth.module';
import { ApiModule } from './api/api.module';

const QUEEN_SECRET = process.env['QUEEN_SECRET'];

@Module({
    imports: [AuthModule, ApiModule,
        JwtModule.register({
            global: true,
            secret: QUEEN_SECRET,
            signOptions: { expiresIn: '60s' },
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
