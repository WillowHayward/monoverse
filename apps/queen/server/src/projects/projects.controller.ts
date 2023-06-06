import { Controller, UseGuards, Get, Req } from '@nestjs/common';
import { Project } from '@whc/queen/model';
import { AuthGuard } from '../auth.guard';
import { Token } from '../decorators/token.decorator';
import { ProjectsService } from './projects.service';

@Controller('projects')
@UseGuards(AuthGuard)
export class ProjectsController {
    constructor(
        private projects: ProjectsService) {}

    // Get Queen projects the current user has access to
    @Get()
    async getProjects(@Token() token: string): Promise<Project[]> {
        return this.projects.getProjects(token);
    }

}
