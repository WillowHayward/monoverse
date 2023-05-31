import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
    selector: 'whc-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
    constructor(private auth: AuthService) {}
    connect() {
        this.auth.getAuthUrl().subscribe(url => {
            console.log(url);

            window.location.href = url;
        });
    }
}
