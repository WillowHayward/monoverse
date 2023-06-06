import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiModule } from './api/api.module';
import { UsersModule } from './users/users.module';
import { UserEntity, ProjectEntity, SessionEntity } from './entities';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
    imports: [
        ApiModule,
        UsersModule,
        AuthModule,
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'queen.db',
            entities: [UserEntity, ProjectEntity, SessionEntity],
            synchronize: true, // TODO: Turn this off for production
        }),
        ProjectsModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
