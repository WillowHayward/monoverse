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
        const token = window.localStorage.getItem('token');
        const expiry = Number.parseInt(window.localStorage.getItem('tokenExpiry') || '0');
        if (this.validateToken(token, expiry)) {
            this.router.navigate(['/']);
        }

        this.route.queryParams.subscribe(params => {
            const token = params['token'];
            const expiry = params['expiry'];

            //const returnUrl = params['return'] ?? '/';

            if (token && expiry) {
                window.localStorage.setItem('token', token);
                window.localStorage.setItem('tokenExpiry', expiry);
                this.router.navigate(['/']);
            }
        });
    }
    
    connect() {
        this.auth.getAuthUrl().subscribe(url => {
            console.log(url);

            window.location.href = url;
        });
    }

    private validateToken(token: string | null, expiry: number): boolean {
        if (!token || !expiry) {
            return false;
        }

        const now = (new Date()).valueOf();

        if (expiry < now) {
            return false;
        }

        return true;
    }
}
