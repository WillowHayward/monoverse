import { LocalClient } from './LocalClient';

export class LocalUser {
    public data = {};
    public client: LocalClient;
    public lw;
    constructor(client, lw) {
        this.client = client;
        this.lw = lw;
    }

    public send(evt, data) {
        this.client.emit(evt, data);
    }
}
