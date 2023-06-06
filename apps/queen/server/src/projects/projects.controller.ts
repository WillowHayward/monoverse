import { Controller, UseGuards, Get, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { AuthGuard } from '../auth.guard';
import { Token } from '../decorators/token.decorator';
import { ProjectEntity, SessionEntity, UserEntity } from '../entities';
import { ProjectsService } from './projects.service';

@Controller('projects')
@UseGuards(AuthGuard)
export class ProjectsController {
    constructor(
        @InjectRepository(UserEntity) private users: Repository<UserEntity>,
        private projects: ProjectsService) {}

    // Get Queen projects the current user has access to
    @Get()
    async getProjects(@Token() token: string, @Req() request: Request): Promise<ProjectEntity[]> {
        const session: SessionEntity = request['session'];
        const userId = session.user_id;
        const user = await this.users.findOneBy({ id: userId });
        if (!user) {
            throw new Error('i do not know how this happened');
        }

        return this.projects.getProjects(token, user);
    }

}
