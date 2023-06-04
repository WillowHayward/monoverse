import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { ApiModule } from './api/api.module';
import { UsersModule } from './users/users.module';

const QUEEN_SECRET = process.env['QUEEN_SECRET'];

@Module({
    imports: [ApiModule, UsersModule,
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
