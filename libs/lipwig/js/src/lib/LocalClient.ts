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
import * as Logger from 'loglevel';

// TODO: If the host gets disconnected, should this also emit disconnected?
// TODO: For registering with server, get number with 'abcd-efg-hij'.match(/-([^-]*)$/)

export class LocalClient extends Client {
    protected override name = 'LocalClient';
    constructor(
        public host: Host,
        room: string,
        options: UserOptions = {}
    ) {
        super('', room, options);

        const id = host.getNewLocalClientID();
        this.id = id;

        host.addLocalClient(this);

        // 100 Milliseconds to allow listeners to be set
        // TODO: Check for race conditions
        setTimeout(() => {
            this.sendToHost({
                event: SERVER_HOST_EVENT.JOINED,
                data: {
                    id,
                    options
                }
            });

            this.emit(SERVER_CLIENT_EVENT.JOINED, id);
        }, 100);
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

        this.sendToHost(message);
    }

    public override leave(reason?: string) {
        const message: ServerHostEvents.Left = {
            event: SERVER_HOST_EVENT.LEFT,
            data: {
                id: this.id,
                reason
            }
        }

        this.sendToHost(message);
    }

    private sendToHost(message: ServerHostEvents.Event) {
        Logger.debug(`[${this.name}] Sending '${message.event}' `);
        // Stringify + parse to prevent editing by reference and to simulate real process
        message = JSON.parse(JSON.stringify(message));

        this.host.handle(message);
    }

    // TODO: With a protected sendToHost event in Client, this wouldn't need overriding
    public override handle(message: ServerClientEvents.Event): void {
        Logger.debug(`[${this.name}] Received '${message.event}' event`);
        message = JSON.parse(JSON.stringify(message));
        let eventName: string = message.event;

        // In theory this should never be from a socket
        const args: unknown[] = [];
        switch (message.event) {
            case SERVER_CLIENT_EVENT.JOINED:
                Logger.debug(`[${this.name}] Joined ${this.room}`);
                this.id = message.data.id;
                break;
            case SERVER_CLIENT_EVENT.MESSAGE:
                Logger.debug(`[${this.name}] Received '${message.data.event}' message`);
                args.push(...message.data.args.concat(message));
                eventName = message.data.event;

                this.emit(message.event, eventName, ...args, this); // Emit 'lw-message' event on all messages
                break;
            case SERVER_CLIENT_EVENT.PING_CLIENT:
                this.sendToHost({
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
