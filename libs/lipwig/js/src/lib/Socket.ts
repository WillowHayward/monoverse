import {
    CLIENT_EVENT,
    ClientEvent,
    ReconnectEvent,
    ServerEvent,
    ServerMessageEvent,
} from '@whc/lipwig/model';
import { EventManager } from './EventManager';

export class Socket extends EventManager {
    private socket: WebSocket;
    private retry: boolean;
    private id: string | undefined;
    private room: string | undefined;
    constructor(private url: string) {
        super();
        this.url = url;

        this.socket = new WebSocket(url);
        console.log('New WebSocket', this.socket);
        this.retry = true; //TODO: Make this an option on creation
        this.socket.addEventListener('open', () => {
            this.emit('connected');
        });
        this.addListeners();
    }

    private addListeners(): void {
        this.socket.addEventListener('error', () => {
            this.emit('error');
            // TODO: error handling
        });

        this.socket.addEventListener('message', (event: MessageEvent) => {
            const message: ServerEvent = JSON.parse(event.data);
            this.emit('message', message);
        });

        this.socket.addEventListener('close', () => {
            this.emit('disconnected');

            if (!this.room || !this.id) {
                console.log('Room or ID not set');
                // Nothing to reconnect to
                return;
            }

            if (this.retry) {
                this.autoReconnect();
            }
        });
    }

    public send(message: ClientEvent): void {
        //TODO: Add in contingency system for messages sent during a disconnection
        //CONT: A queue of messages to be sent in bulk on resumption of connection
        //CONT: Possible return unsent messages from this method
        this.socket.send(JSON.stringify(message));
    }

    private autoReconnect(): void {
        console.log('Attempting to reconnect');
        const socket: WebSocket = new WebSocket(this.url);

        socket.addEventListener('error', (): void => {
            console.log('Reconnect failed, retrying');
            setTimeout(this.autoReconnect, 1000);
        });

        socket.addEventListener('open', (): void => {
            this.reconnect(socket);
        });
    }

    public setData(room: string, id: string) {
        this.room = room;
        this.id = id;
    }

    public reconnect(socket: WebSocket): void {
        if (!this.room || !this.id) {
            // Nothing to reconnect to
            return;
        }

        console.log('Reconnected');
        this.socket = socket;
        this.addListeners();
        const message: ReconnectEvent = {
            event: CLIENT_EVENT.RECONNECT,
            data: {
                code: this.room,
                id: this.id,
            },
        };

        this.send(message);
    }
}
