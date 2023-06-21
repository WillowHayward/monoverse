import { Injectable } from '@angular/core';
import { Client, Host, Lipwig } from '@whc/lipwig/js';

import { CreateOptions, JoinOptions } from '@whc/lipwig/model';

interface ReconnectData {
    code: string;
    id: string;
}

@Injectable({
    providedIn: 'root',
})
export class LipwigService {
    isHost: boolean = false;

    connected: boolean = false;

    constructor() {}

    public async createRoom(
        name: string,
        reconnect?: ReconnectData
    ): Promise<Host> {
        this.isHost = true;

        const config: CreateOptions = {
            approvals: true
        };

        if (reconnect) {
            config.reconnect = reconnect;
        }

        return Lipwig.create(window.env['LIPWIG_HOST'], config).then((host) => {
            this.connected = true;

            this.setSessionData(name, host.room, host.id, true);

            return host;
        });
    }

    public async joinRoom(
        name: string,
        code: string,
        reconnect?: string
    ): Promise<Client> {
        const options: JoinOptions = { 
            data: {
                name 
            }
        };

        if (reconnect) {
            options.reconnect = reconnect;
        }

        return Lipwig.join(window.env['LIPWIG_HOST'], code, options).then(
            (client) => {
                this.connected = true;

                this.setSessionData(name, client.room, client.id, false);

                return client;
            }
        );
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
