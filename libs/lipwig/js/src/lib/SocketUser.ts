/**
 * @author: WillHayCode
 */
import {
    CLIENT_EVENT,
    ReconnectEvent,
    PingEvent,
    ClientEvent,
} from '@whc/lipwig/types';
import { EventManager } from './EventManager';

export abstract class SocketUser extends EventManager {
    public id: string = '';
    public room: string = '';




    protected abstract handle(event: MessageEvent): void;

    protected abstract connected(): void;

    /*
    public ping(): void {
        const now: number = new Date().getTime();
        const message: PingEvent = {
            event: CLIENT_EVENT.PING,
            data: {
                time: now,
            },
        };
        this.sendMessage(message);
    }

    private pong(then: number): boolean {
        const now: number = new Date().getTime();
        const ping: number = now - then;
        this.emit('pong', ping);

        return false;
    }
    */
}
