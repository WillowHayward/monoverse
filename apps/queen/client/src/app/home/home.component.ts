import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '@whc/queen/model';
import { ApiService } from '../api.service';

@Component({
    selector: 'whc-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    projects: Project[] = [];
    constructor(private api: ApiService, private router: Router) { }

    ngOnInit(): void {
        this.api.getProjects().subscribe(projects => {
            this.projects = projects;
        });
    }

    addProject() {
        this.router.navigate(['/add']);
    }
}
