/*
 * @author: WillHayCode
 */
import { EventManager } from '../EventManager';
import { Group } from './Group';
import { Host } from './Host';
import { LocalClient } from '../client';
import {
    HOST_EVENT,
    SERVER_CLIENT_EVENT,
    HostEvents,
    ServerClientEvents,
} from '@whc/lipwig/model';
import { Poll } from './Poll';

// TODO: Can the local stuff be moved into Host?
export class User extends EventManager {
    public client: LocalClient | null = null;
    public data: {[key: string]: any};
    private groups: Group[] = [];

    constructor(public id: string, private parent: Host, data?: {[key: string]: any}, public local = false) {
        super();
        if (!data) {
            data = {};
        }
        this.data = data;
    }

    public override emit(event: string, ...args: any[]) {
        super.emit(event, ...args);
        for (const group of this.groups) {
            group.emit(event, this, ...args);
        }
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

    public poll(query: string, id?: string): Poll {
        return this.parent.poll([this], query, id);
    }

    public assign(name: string, inform = false): void {
        const group = this.parent.assign(this, name, inform);
        this.groups.push(group);
    }

    public unassign(name: string, inform = false): void {
        const group = this.parent.unassign(this, name, inform);
        const index = this.groups.indexOf(group);
        this.groups.splice(index, 1);
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

    public ping(): Promise<number> {
        return this.parent.ping(this.id);
    }

    public getLocalClient(): LocalClient | null {
        return this.client;
    }
}
