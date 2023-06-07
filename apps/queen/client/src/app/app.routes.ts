import { Route } from '@angular/router';
import { AddProjectComponent } from './add-project/add-project.component';
import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

export const appRoutes: Route[] = [
    {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'add',
        component: AddProjectComponent,
        canActivate: [AuthGuard]
    }
];
