import { Route } from '@angular/router';
import { JoinComponent } from './join/join.component';

export const appRoutes: Route[] = [
    {
        path: '',
        component: JoinComponent
    },
    // TODO: Add in ':codes' path here for reconnection
];
