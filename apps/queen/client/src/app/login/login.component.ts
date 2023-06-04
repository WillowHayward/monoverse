import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';

@Component({
    selector: 'whc-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute, private apiService: ApiService) {}

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            const token = params['token'];

            const returnUrl = params['return'] ?? '';

            if (token) {
                console.log(token);

                this.apiService.testRequest(token).subscribe(resp => {
                    console.log(resp);

                });
                /*this.router.navigate([returnUrl]).catch(() => {
                    this.router.navigate(['']);

                });*/
            }
        });
    }
    
    connect() {
        this.auth.getAuthUrl().subscribe(url => {
            console.log(url);

            window.location.href = url;
        });
    }
}
