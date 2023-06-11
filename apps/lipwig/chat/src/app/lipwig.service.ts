import { Injectable } from '@angular/core';
import { Client, Host, Lipwig } from '@whc/lipwig/js';

import { RoomConfig, UserOptions } from '@whc/lipwig/model';

interface ReconnectData {
    code: string;
    id: string;
}

@Injectable({
    providedIn: 'root',
})
export class LipwigService {
    isHost: boolean = false;

    host: Host;
    client: Client;

    code: string;

    connected: boolean = false;

    constructor() {}

    public async createRoom(
        name: string,
        reconnect?: ReconnectData
    ): Promise<Client> {
        this.isHost = true;

        const config: RoomConfig = { name };

        if (reconnect) {
            config.reconnect = reconnect;
        }

        return Lipwig.create(window.env['LIPWIG_HOST'], config).then((host) => {
            this.code = host.room;
            this.host = host;
            this.connected = true;

            this.setSessionData(name, host.room, host.id, true);

            const client = host.createLocalClient({
                name,
            });
            this.client = client;

            return client;
        });
    }

    public async joinRoom(
        name: string,
        code: string,
        reconnect?: string
    ): Promise<Client> {
        const options: UserOptions = { name };

        if (reconnect) {
            options.reconnect = reconnect;
        }
        return Lipwig.join(window.env['LIPWIG_HOST'], code, options).then(
            (client) => {
                this.code = client.room;
                this.client = client;
                this.connected = true;

                this.setSessionData(name, client.room, client.id, false);

                return client;
            }
        );
    }

    public getHost(): Host | undefined {
        return this.host;
    }

    public getClient(): Client | undefined {
        return this.client;
    }

    private setSessionData(
        name: string,
        code: string,
        id: string,
        isHost: boolean
    ) {
        window.sessionStorage.setItem('name', name);
        window.sessionStorage.setItem('code', code);
        window.sessionStorage.setItem('id', id);

        const host = isHost ? 'true' : 'false';
        window.sessionStorage.setItem('host', host);
    }
}
