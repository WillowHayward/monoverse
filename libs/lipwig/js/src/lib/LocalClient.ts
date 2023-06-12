/**
 * @author: WillHayCode
 */
import { Host } from './Host';
import {
    SERVER_CLIENT_EVENT,
    SERVER_HOST_EVENT,
    ServerClientEvents,
    ServerHostEvents,
    UserOptions,
} from '@whc/lipwig/model';
import { Client } from './Client';

export class LocalClient extends Client {
    private parent: Host;
    constructor(
        parent: Host,
        room: string,
        options: UserOptions = {}
    ) {
        super('', room, options);
        this.id = '';
        this.parent = parent;
        this.options = options;
    }

    public override send(event: string, ...args: unknown[]): void {
        const message: ServerHostEvents.Message = {
            event: SERVER_HOST_EVENT.MESSAGE,
            data: {
                event,
                args,
                sender: this.id,
            },
        };

        this.sendToParent(message);
    }

    public override leave(reason?: string) {
        const message: ServerHostEvents.Left = {
            event: SERVER_HOST_EVENT.LEFT,
            data: {
                id: this.id,
                reason
            }
        }

        this.sendToParent(message);
    }

    private sendToParent(message: ServerHostEvents.Event) {
        // Stringify + parse to prevent editing by reference and to simulate real process
        message = JSON.parse(JSON.stringify(message));

        this.parent.handle(message);
    }

    public override handle(message: ServerClientEvents.Event): void {
        message = JSON.parse(JSON.stringify(message));
        let eventName: string = message.event;

        // In theory this should never be from a socket
        const args: unknown[] = [];
        switch (message.event) {
            case SERVER_CLIENT_EVENT.JOINED:
                this.id = message.data.id;
                break;
            case SERVER_CLIENT_EVENT.MESSAGE:
                args.push(...message.data.args.concat(message));
                eventName = message.data.event;

                this.emit(message.event, eventName, ...args, this); // Emit 'lw-message' event on all messages
                break;
            case SERVER_CLIENT_EVENT.PING_CLIENT:
                this.sendToParent({
                    event: SERVER_HOST_EVENT.PONG_CLIENT,
                    data: {
                        time: message.data.time,
                        id: this.id
                    }
                });
                break;
            case SERVER_CLIENT_EVENT.PONG_HOST:
            case SERVER_CLIENT_EVENT.PONG_SERVER:
                const now = (new Date()).getTime();
                const ping = now - message.data.time;
                args.push(ping);
                break;
        }

        this.emit(eventName, ...args);
    }

    public override ping(full?: boolean): Promise<number> {
        // TODO
        return Promise.resolve(0);
    }
}
