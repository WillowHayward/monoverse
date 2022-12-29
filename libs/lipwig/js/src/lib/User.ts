/**
 * @author: WillHayCode
 */
import { EventManager } from '@whc/event-manager';
import { Host } from './Host';
import { LocalClient } from './LocalClient';
import { LipwigMessageEvent, CLIENT_EVENT } from '@whc/lipwig/types';

export class User extends EventManager {
    public client: LocalClient | undefined;
    constructor(public id: string, private parent: Host, public local = false) {
        super();
    }

    public send(event: string, ...args: unknown[]): void {
        const message: LipwigMessageEvent = {
            event: CLIENT_EVENT.MESSAGE,
            data: {
                event,
                args,
                sender: this.parent.id,
                recipient: [this.id],
            },
        };

        if (this.local) {
            this.client?.handle(message);
        } else {
            this.parent.sendMessage(message);
        }
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
