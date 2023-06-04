import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiModule } from './api/api.module';
import { UsersModule } from './users/users.module';
import { User } from './database/entities/user.entity';
import { AuthModule } from './auth/auth.module';

const QUEEN_SECRET = process.env['QUEEN_SECRET'];

@Module({
    imports: [
        ApiModule,
        UsersModule,
        AuthModule,
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'queen.db',
            entities: [User],
            synchronize: true // TODO: Turn this off for production
        }),
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
