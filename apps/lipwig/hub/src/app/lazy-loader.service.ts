import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class LazyLoaderService {

    private apps: Record<string, {
        routes: () => Promise<Route[]>;
        name: string;
    }> = {
            'rock-off': {
                routes: () => import('@whc/rock-off/client').then(mod => mod.rockOffClientRoutes),
                name: 'Rock Off'
            },
            'lipwig-chat': {
                routes: () => import('@whc/lipwig/chat/client').then(mod => mod.lipwigChatClientRoutes),
                name: 'Lipwig Chat'
            }
        }

    private routes: Promise<Route[]>;

    constructor(private router: Router) { }

    getAppName(roomName: string): string {
        if (!this.apps[roomName]) {
            throw new Error(`Application '${roomName}' not recognized`);
        }

        return this.apps[roomName].name;
    }

    async preload(roomName: string) {
        if (!this.apps[roomName]) {
            throw new Error(`Application '${roomName}' not recognized`);
        }

        const callback = this.apps[roomName].routes;
        this.routes = callback();
        this.routes.then(routes => {
            const config = this.router.config;
            let route = config.find(route => route.path === ':code');

            if (!route) {
                route = {
                    path: ':code',
                }
                config.push(route);
            }

            route.children = routes;
            this.router.resetConfig(config);
        });
    }

    async navigate(code: string): Promise<void> {
        this.routes.then(() => {
            this.router.navigate([code], { skipLocationChange: true });
        });
    }
}
