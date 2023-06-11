/**
 * @author: WillHayCode
 */
import { User } from './User';
import { Host } from './Host';
import {
    SERVER_EVENT,
    ServerEvent,
    ServerMessageEvent,
    UserOptions,
} from '@whc/lipwig/model';
import { Client } from './Client';

export class LocalClient extends Client {
    private parent: Host;
    private user: User;
    constructor(
        parent: Host,
        user: User,
        code: string,
        options: UserOptions = {}
    ) {
        super(null, code, options);
        this.id = '';
        this.parent = parent;
        this.user = user;
        this.options = options;
    }

    public override send(event: string, ...args: unknown[]): void {
        let message: ServerEvent = {
            event: SERVER_EVENT.MESSAGE,
            data: {
                event,
                args,
                sender: this.id,
            },
        };

        // Stringify + parse to prevent editing by reference and to simulate real process
        message = JSON.parse(JSON.stringify(message));

        this.parent.handle(message);
    }

    public override handle(message: ServerEvent): void {
        message = JSON.parse(JSON.stringify(message));
        let eventName: string = message.event;

        // In theory this should never be from a socket
        const args: unknown[] = [];
        switch (message.event) {
            case SERVER_EVENT.JOINED:
                this.id = message.data.id;
                break;
            case SERVER_EVENT.MESSAGE:
                args.push(...message.data.args.concat(message));
                eventName = message.data.event;

                this.emit(message.event, eventName, ...args, this); // Emit 'lw-message' event on all messages
                break;
        }

        this.emit(eventName, ...args);
    }
}
