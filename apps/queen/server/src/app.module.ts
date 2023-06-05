import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiModule } from './api/api.module';
import { UsersModule } from './users/users.module';
import { User, Project } from './entities';
import { AuthModule } from './auth/auth.module';
import { ProjectService } from './project/project.service';
import { ProjectModule } from './project/project.module';
import { QUEEN_SECRET } from './constants';

@Module({
    imports: [
        ApiModule,
        UsersModule,
        AuthModule,
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'queen.db',
            entities: [User, Project],
            synchronize: true, // TODO: Turn this off for production
        }),
        JwtModule.register({
            global: true,
            secret: QUEEN_SECRET,
            signOptions: { expiresIn: '60s' },
        }),
        ProjectModule,
    ],
    controllers: [],
    providers: [ProjectService],
})
export class AppModule {}
