import { Route } from '@angular/router';
import { AuthorizeComponent } from './authorize/authorize.component';
import { LoginComponent } from './login/login.component';

export const appRoutes: Route[] = [
    {
        path: '',
        component: LoginComponent
    },
    {
        path: 'authorize',
        component: AuthorizeComponent
    }
];
