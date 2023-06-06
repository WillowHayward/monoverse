import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { ApiModule } from '../api/api.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Project, Session } from '../entities';

@Module({
    imports: [ApiModule, TypeOrmModule.forFeature([User, Session, Project])],
    providers: [ProjectsService],
    controllers: [ProjectsController],
})
export class ProjectsModule {}
