import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiModule } from './api/api.module';
import { UsersModule } from './users/users.module';
import { User, Project, Session } from './entities';
import { AuthModule } from './auth/auth.module';
import { ProjectService } from './project/project.service';
import { ProjectModule } from './project/project.module';

@Module({
    imports: [
        ApiModule,
        UsersModule,
        AuthModule,
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'queen.db',
            entities: [User, Project, Session],
            synchronize: true, // TODO: Turn this off for production
        }),
        ProjectModule,
    ],
    controllers: [],
    providers: [ProjectService],
})
export class AppModule {}
