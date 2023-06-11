/*
 * @author: WillHayCode
 */
import { EventManager } from './EventManager';
import { Host } from './Host';
import { LocalClient } from './LocalClient';
import {
    HOST_EVENT,
    SERVER_CLIENT_EVENT,
    HostEvents,
    ServerClientEvents,
    UserOptions,
} from '@whc/lipwig/model';

export class User extends EventManager {
    public client: LocalClient | null = null;
    public data: {[key: string]: any};
    constructor(public id: string, private parent: Host, data?: {[key: string]: any}, public local = false) {
        super();
        if (!data) {
            data = {};
        }
        this.data = data;
    }

    public send(event: string, ...args: unknown[]): void {
        if (this.local && this.client) {
            const message: ServerClientEvents.Message = {
                event: SERVER_CLIENT_EVENT.MESSAGE,
                data: {
                    event,
                    args,
                },
            };
            this.client.handle(message);
        } else {
            const message: HostEvents.Message = {
                event: HOST_EVENT.MESSAGE,
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

    public kick(reason?: string): void {
        if (this.local && this.client) {
            this.client.emit('kicked', reason);
            return;
        }

        const message: HostEvents.Kick = {
            event: HOST_EVENT.KICK,
            data: {
                id: this.id,
                reason,
            },
        };
        this.parent.send(message);
    }

    public getLocalClient(): LocalClient | null {
        return this.client;
    }
}
