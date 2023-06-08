/**
 * @author: WillHayCode
 */
import { EventManager } from './EventManager';
import { Host } from './Host';
import { LocalClient } from './LocalClient';
import { ClientMessageEvent, CLIENT_EVENT, ServerMessageEvent, SERVER_EVENT } from '@whc/lipwig/types';

export class User extends EventManager {
    public client: LocalClient | undefined;
    constructor(public id: string, private parent: Host, public local = false) {
        super();
    }

    public send(event: string, ...args: unknown[]): void {
        if (this.local && this.client) {
            const message: ServerMessageEvent = {
                event: SERVER_EVENT.MESSAGE,
                data: {
                    event,
                    args,
                },
            };
            this.client.handle(message);
        } else {
            const message: ClientMessageEvent = {
                event: CLIENT_EVENT.MESSAGE,
                data: {
                    event,
                    args,
                    recipients: [this.id],
                },
            };
            this.parent.send(message);
        }
    }

    public sendToOthers(event: string, ...args: unknown[]): void {
        this.parent.sendToAllExcept(event, this, ...args);
    }

    public assign(name: string): void {
        this.parent.assign(this, name);
    }

    public unassign(name: string): void {
        this.parent.unassign(this, name);
    }

    public kick(reason = ''): void {
        // TODO: For a local client this won't quite work I believe
        this.send('kick', this.id, reason);
    }
}
