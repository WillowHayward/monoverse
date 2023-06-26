import { Injectable } from '@angular/core';

import { CreateOptions, JoinOptions, RoomQuery } from '@whc/lipwig/model';
import { Client, Host, Lipwig, LocalClient, LocalHost } from '@whc/lipwig/js';

// TODO: It's an edge case, but accounting for multiple hosts/clients in a single connection could be neat
@Injectable({
    providedIn: 'root'
})
export class LipwigService {
    private host?: Host;
    private client?: Client;
    public connected = false;

    public async query(url: string, room: string): Promise<RoomQuery> {
        return Lipwig.query(url, room);
    }

    public async create(url: string, options: CreateOptions): Promise<Host> {
        const promise = Lipwig.create(url, options);
        promise.then(host => {
            this.host = host;
            this.connected = true;
        });
        return promise;
    }

    public async createLocal(options: CreateOptions): Promise<LocalHost> {
        const host = new LocalHost(options);
        this.host = host;
        return host;
    }

    public async join(url: string, code: string, options: JoinOptions): Promise<Client> {
        const promise = Lipwig.join(url, code, options);
        promise.then(client => {
            this.client = client;
            this.connected = true;
        });
        return promise;
    }

    public async joinLocal(options: JoinOptions): Promise<LocalClient> {
        if (!this.host) {
            throw new Error('Must create room before making local client');
        }
        const client = this.host.createLocalClient(options);
        this.client = client;

        return client;
    }

    public getHost(): Host | undefined {
        return this.host;
    }

    public getClient(): Client | undefined {
        return this.client;
    }

}
