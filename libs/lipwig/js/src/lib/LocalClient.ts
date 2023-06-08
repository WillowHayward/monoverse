/**
 * @author: WillHayCode
 */
import { User } from './User';
import { Host } from './Host';
import { SERVER_EVENT, ServerEvent, ServerMessageEvent, UserOptions } from '@whc/lipwig/types';
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
        let message: ServerEvent = {
            event: SERVER_EVENT.MESSAGE,
            data: {
                event,
                args,
                sender: this.id

            }
        }

        // Stringify + parse to prevent editing by reference and to simulate real process
        message = JSON.parse(JSON.stringify(message));

        this.parent.handle(message);
    }

    public override handle(message: ServerMessageEvent): void {
        message = JSON.parse(JSON.stringify(message));
        // In theory this should never be from a socket
        const args: unknown[] = [];
        if (message.event === SERVER_EVENT.MESSAGE) {
            args.push(...message.data.args.concat(message));
        }

        this.reserved.emit(message.event, ...args);
        this.emit(message.data.event, ...args);
    }
}
