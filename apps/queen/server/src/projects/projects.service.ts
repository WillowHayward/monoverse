import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '@whc/queen/model';
import { Repository } from 'typeorm';
import { ApiService } from '../api/api.service';
import { ProjectEntity } from '../entities';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(ProjectEntity) private projects: Repository<ProjectEntity>,
        private api: ApiService) { }

    async getProjects(token: string): Promise<Project[]> {
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

        return projects;
    }

}
