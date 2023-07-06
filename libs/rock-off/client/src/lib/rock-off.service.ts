import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LipwigService } from '@lipwig/angular';
import { Client, Query } from '@lipwig/js';
import { Move } from '@whc/rock-off/common';

@Injectable({
    providedIn: 'root'
})
export class RockOffService {
    private client: Client;
    private currentPoll?: Query;
    public name: string;
    public vip: Promise<boolean>;
    constructor(lipwig: LipwigService, private router: Router) {
        const client = lipwig.getClient();
        if (!client) {
            throw new Error('Client not initialized');
        }

        this.client = client;
        this.name = client.data['name'] || '';

        this.vip = new Promise<boolean>(resolve => {
            client.once('vip', () => {
                resolve(true);
            });
        });

        client.on('wait', () => {
            this.navigate('wait');
        });

        client.on('poll', query => {
            this.currentPoll = query;
            this.navigate('play');
        });

        client.on('eliminated', () => {
            this.navigate('eliminated');
        });
    }

    public start() {
        this.client.send('start');
    }

    public play(move: Move) {
        if (!this.currentPoll) {
            throw new Error('willow handle this'); //TODO
        }

        this.currentPoll.respond(move);
        this.navigate('wait');
    }

    private navigate(page: string) {
        const room = this.client.room;
        this.router.navigateByUrl(`${room}/${page}`, { skipLocationChange: true });
    }
}
