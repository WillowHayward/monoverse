import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiService } from '../api/api.service';
import { ProjectEntity, UserEntity } from '../entities';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(ProjectEntity) private projects: Repository<ProjectEntity>,
        private api: ApiService) { }

    async getProjects(token: string, user: UserEntity): Promise<ProjectEntity[]> {
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
