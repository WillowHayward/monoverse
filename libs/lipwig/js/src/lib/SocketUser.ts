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

    /*private autoReconnect(): void {
        const socket: WebSocket = new WebSocket(this.url);

        socket.addEventListener('error', (): void => {
            setTimeout(this.autoReconnect, 1000);
        });

        socket.addEventListener('open', (): void => {
            this.reconnect(socket);
        });
    }

    public reconnect(socket: WebSocket): void {
        this.socket = socket;
        this.addListeners();
        const message: ReconnectEvent = {
            event: CLIENT_EVENT.RECONNECT,
            data: {
                code: '', // TODO: Stub
                id: this.id,
            },
        };
        this.sendMessage(message);
    }

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
    }*/
}
