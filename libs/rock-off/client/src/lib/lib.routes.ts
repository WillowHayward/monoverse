import { Route } from '@angular/router';
import { PlayComponent } from './play/play.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { WaitComponent } from './wait/wait.component';
import { EliminatedComponent } from './eliminated/eliminated.component';

export const rockOffClientRoutes: Route[] = [
    {
        path: '',
        component: WelcomeComponent
    },
    {
        path: 'wait',
        component: WaitComponent
    },
    {
        path: 'play',
        component: PlayComponent
    },
    {
        path: 'eliminated',
        component: EliminatedComponent
    }
];
