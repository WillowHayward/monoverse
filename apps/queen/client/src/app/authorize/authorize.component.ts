import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
    selector: 'whc-authorize',
    templateUrl: './authorize.component.html',
    styleUrls: ['./authorize.component.scss'],
})
export class AuthorizeComponent implements OnInit {
    constructor(private auth: AuthService, private route: ActivatedRoute) {}

    ngOnInit(): void {

        this.route.queryParams.subscribe(params => {
            this.auth.getToken(params['state'], params['code']).subscribe(token => {
                this.auth.testRequest(token);
            });
        });
        
    }
}
