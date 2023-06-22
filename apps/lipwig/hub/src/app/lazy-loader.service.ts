import { Injectable } from '@angular/core';
import { LoadChildrenCallback, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class LazyLoaderService {
    private callbacks: Record<string, LoadChildrenCallback> = {
        'rock-off': () => import('@whc/rock-off/client').then(mod => mod.RockOffClientModule),
        'lipwig-chat': () => import('@whc/lipwig/chat/client').then(mod => mod.LipwigChatClientModule),
    }
  constructor(private router: Router) { }

    async navigate(code: string, roomName?: string): Promise<void> {
        if (!roomName) {
            throw new Error();
        }

        const config = this.router.config;
        let route = config.find(route => route.path === ':code');

        if (!route) {
            route = {
                path: ':code',
            }
            config.push(route);
        }

        const callback = this.callbacks[roomName];
        if (!callback) {
            throw new Error(`Application '${roomName}' not recognized`);
        }

        route.loadChildren = callback;

        this.router.resetConfig(config);
        this.router.navigate([code]);
    }
}
