import { Route } from '@angular/router';
import { RoomComponent } from '@whc/lipwig/chat/common';

export const lipwigChatClientRoutes: Route[] = [
    {
        path: '',
        component: RoomComponent
    }
];
