/**
 * @author: WillHayCode
 */
import { Host } from '../host';
import {
    SERVER_CLIENT_EVENT,
    SERVER_HOST_EVENT,
    ServerClientEvents,
    ServerHostEvents,
    JoinOptions,
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
        options: JoinOptions = {}
    ) {
        super('', room, options);

        const id = host.getNewLocalClientID();
        this.id = id;

        if (host.locked) {
            // TODO: Throw failure
            return;
        }

        host.addLocalClient(this);

        // 100 Milliseconds to allow listeners to be set
        // TODO: Check for race conditions
        setTimeout(() => {
            this.sendToHost({
                event: SERVER_HOST_EVENT.JOINED,
                data: {
                    id,
                    data: options?.data
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

    public override handle(message: ServerClientEvents.Event): void {
        message = JSON.parse(JSON.stringify(message));
        super.handle(message);
    }

    public override ping(full?: boolean): Promise<number> {
        // TODO
        return Promise.resolve(0);
    }

    protected override pingClient(time: number) {
        this.sendToHost({
            event: SERVER_HOST_EVENT.PONG_CLIENT,
            data: {
                time,
                id: this.id
            }
        });
    }
}
