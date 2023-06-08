/**
 * @author: WillHayCode
 */
import * as EventManager from 'events';
import {
    CLIENT_EVENT,
    GenericEvent,
    LipwigMessageEvent,
    ReconnectEvent,
    PingEvent,
} from '@whc/lipwig/types';

export abstract class SocketUser {
    public id: string = '';
    public room: string = '';
    protected reserved: EventManager;
    protected events: EventManager;
    private socket: WebSocket;
    private retry: boolean;
    private url: string;
    constructor(url: string) {
        this.url = url;
        this.events = new EventManager();
        this.reserved = new EventManager();
        //this.reserved.on('ping', this.pong, this);

        this.socket = new WebSocket(url);
        this.retry = false;
        //TODO: Make this an option on creation
        this.addListeners();
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

    public sendMessage(message: GenericEvent): void {
        //TODO: Add in contingency system for messages sent during a disconnection
        //CONT: A queue of messages to be sent in bulk on resumption of connection
        if (message.event === CLIENT_EVENT.MESSAGE) {
            const messageEvent = message as LipwigMessageEvent; //TODO - There's gotta be a cleaner way to do this
            if (messageEvent.data.sender.length === 0) {
                messageEvent.data.sender = this.id;
            }
            message = messageEvent;
        }
        console.log(message);
        this.socket.send(JSON.stringify(message));
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

    protected setID(id: string): void {
        this.id = id;
    }

    protected abstract handle(event: MessageEvent): void;

    protected abstract connected(): void;

    private addListeners(): void {
        this.socket.addEventListener('open', () => {
            this.emit('connected');
            this.connected();
        });
        this.socket.addEventListener('error', () => {
            // TODO: error handling
        });
        this.socket.addEventListener('message', (event: MessageEvent) => {
            console.log(event);
            this.handle(event);
        });
        this.socket.addEventListener('close', () => {
            if (this.retry) {
                this.autoReconnect();
            }
            this.emit('reconnected');
            // TODO: This is a stub - connection close handling
        });
    }

    private autoReconnect(): void {
        const socket: WebSocket = new WebSocket(this.url);

        socket.addEventListener('error', (): void => {
            setTimeout(this.autoReconnect, 1000);
        });

        socket.addEventListener('open', (): void => {
            this.reconnect(socket);
        });
    }

    private pong(then: number): boolean {
        const now: number = new Date().getTime();
        const ping: number = now - then;
        this.emit('pong', ping);

        return false;
    }

    public on(eventName: string, listener: ((...args: any[]) => void)) {
        this.events.on(eventName, listener);
    }

    public once(eventName: string, listener: ((...args: any[]) => void)) {
        this.events.once(eventName, listener);
    }

    public emit(eventName: string, ...args: any[]) {
        this.events.emit(eventName, ...args);
    }
}
