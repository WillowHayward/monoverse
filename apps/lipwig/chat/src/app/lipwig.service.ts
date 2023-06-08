import { Injectable } from '@angular/core';
import { Client, Host } from '@whc/lipwig/js';

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

        return new Promise((resolve, reject) => {
            const host = new Host(window.env['LIPWIG_HOST'], {
                name
            });

            host.on('created', (code: string) => {
                this.code = code;
                this.host = host;
                resolve(host);
            });
        });
    }

    public joinRoom(name: string, code: string): Promise<Client> {
        return new Promise((resolve, reject) => {
            const client = new Client(window.env['LIPWIG_HOST'], code, {
                name
            });

            client.on('joined', () => {
                this.code = code;
                this.client = client;
                resolve(client);
            });

        });
    }

    public getHost(): Host | undefined {
        return this.host;
    }

    public getClient(): Client | undefined {
        return this.client;
    }
}
