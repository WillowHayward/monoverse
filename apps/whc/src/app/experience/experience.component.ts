import { Component } from '@angular/core';

import * as experienceJSON from '../../assets/json/experience.json';

type Job = {
    company: string;
    position: string;
    description: string;
    skills: string[];
    worked: string;
};

@Component({
    selector: 'whc-experience',
    templateUrl: './experience.component.html',
    styleUrls: ['./experience.component.scss'],
})
export class ExperienceComponent {
    experience: Job[] = [];
    constructor() {
        const experienceArray = Array.from(experienceJSON);
        console.log(experienceArray);
        for (const jobJSON of experienceArray) {
            const job: Job = {
                company: jobJSON.company,
                position: jobJSON.position,
                description: jobJSON.description,
                skills: jobJSON.skills,
                worked: jobJSON.worked,
            }
            this.experience.push(job);

        }

    }
}
