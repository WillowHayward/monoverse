import { Controller, UseGuards, Get, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { ApiService } from '../api/api.service';
import { AuthGuard } from '../auth.guard';
import { Token } from '../decorators/token.decorator';
import { Project, Session, User } from '../entities';

@Controller('projects')
@UseGuards(AuthGuard)
export class ProjectsController {
    constructor(
        @InjectRepository(Project) private projects: Repository<Project>,
        @InjectRepository(User) private users: Repository<User>,
        private api: ApiService) {}

    // Get Queen projects the current user has access to
    @Get()
    async getProjects(@Token() token: string, @Req() request: Request): Promise<Project[]> {
        const session: Session = request['session'];
        const userId = session.user_id;
        const user = await this.users.findOneBy({ id: userId });
        if (!user) {
            throw new Error('i do not know how this happened');
        }

        const repos = await this.api.getRepos(token);
        if (!repos.length) {
            return [];
        }

        const repoIds: { id: number }[] = [];
        for (const repo of repos) {
            repoIds.push({
                id: repo.id
            });

        }
        const projects = await this.projects.findBy(repoIds);

        /*const projects: Project[] = [{
            id: 1,
            name: 'Project 1',
            owner_id: 1,
            owner_name: 'Project 1 Owner Name'
        }, {
            id: 3,
            name: 'Project 3',
            owner_id: 2,
            owner_name: 'Project 3 Owner Name'
        }];*/

        return projects;
    }

}
