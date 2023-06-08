import { Injectable } from '@angular/core';
import { Client, Host, Lipwig } from '@whc/lipwig/js';

@Injectable({
  providedIn: 'root'
})
export class LipwigService {
    isHost: boolean = false;

    host: Host;
    client: Client;

    code: string;

    constructor() { }

    public createRoom(name: string): Promise<Host> {
        this.isHost = true;

        return Lipwig.create(window.env['LIPWIG_HOST'], {
            name
        }).then(host => {
            this.code = host.room;
            this.host = host;

            return host;
        });
    }

    public joinRoom(name: string, code: string): Promise<Client> {
        return Lipwig.join(window.env['LIPWIG_HOST'], code, {
            name
        }).then(client => {
            this.code = client.room;
            this.client = client;

            return client;
        });
    }

    public getHost(): Host | undefined {
        return this.host;
    }

    public getClient(): Client | undefined {
        return this.client;
    }
}
