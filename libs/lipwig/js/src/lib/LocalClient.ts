/**
 * @author: WillHayCode
 */
import { User } from './User';
import { Host } from './Host';
import { SERVER_EVENT, ServerEvent, UserOptions } from '@whc/lipwig/types';
import { EventManager } from './EventManager';
import { Client } from './Client';

export class LocalClient extends Client {
    private parent: Host;
    private user: User;
    constructor(parent: Host, user: User, code: string, options: UserOptions = {}) {
        super(null, code, options);
        this.id = '';
        this.parent = parent;
        this.user = user;
        this.options = options;
        this.reserved = new EventManager();
        this.reserved.on('joined', (id: string) => {
            this.setID(id);
        });
    }

    public override send(event: string, ...args: unknown[]): void {
        this.parent.emit(event, this.user, ...args);
    }

    public override handle(message: ServerEvent): void {
        // In theory this should never be from a socket
        const args: unknown[] = [];
        if (message.event === SERVER_EVENT.MESSAGE) {
            args.push(...message.data.args.concat(message));
        }

        this.reserved.emit(message.event, ...args);
        this.emit(message.event, ...args);
    }
}
