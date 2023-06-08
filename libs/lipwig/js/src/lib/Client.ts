/**
* g
 * @author: WillHayCode
 */
import {
    JoinEvent,
    ClientMessageEvent,
    UserOptions,
    ServerEvent,
    CLIENT_EVENT,
    SERVER_EVENT,
} from '@whc/lipwig/types';
import { EventManager } from './EventManager';
import { Socket } from './Socket';

export class Client extends EventManager {
    private socket?: Socket;
    protected reserved: EventManager;
    public room: string;
    public id: string = '';
    /**
     * Attempt to join an existing Lipwig room
     * @param url   Websocket url of LipwigCore server
     * @param code  Room code to attempt to join
     * @param data  Data to pass to room host on connection
     */
    constructor(
        url: string | null,
        code: string,
        public options: UserOptions = {}
    ) {
        super();

        if (url) {
            this.socket = new Socket(url);
            this.addSocketListeners();
        }
        this.room = code;
        this.reserved = new EventManager();
        this.reserved.on(SERVER_EVENT.JOINED, (id: string) => {
            this.setID(id);
        });
    }

    // TODO: Move to common file
    private addSocketListeners() {
        if (!this.socket) {
            return;
        }

        this.socket.on('connected', () => {
            this.connected();
        });

        this.socket.on('error', () => {
            // TODO
        });

        this.socket.on('message', (message: ServerEvent) => {
            this.handle(message);
        });

        this.socket.on('reconnected', (socket: Socket) => {
            this.socket = socket;
            this.addSocketListeners();
        });
    }

    /**
     * Send a message to the host
     * @param event The event name
     * @param args  Arguments to send
     */
    public send(event: string, ...args: unknown[]): void {
        const message: ClientMessageEvent = {
            event: CLIENT_EVENT.MESSAGE,
            data: {
                event,
                args,
            },
        };
        this.socket?.send(message);
    }

    /**
     * Final stage of connection handshake - sends join message to LipwigCore server
     */
    protected connected(): void {
        const message: JoinEvent = {
            event: CLIENT_EVENT.JOIN,
            data: {
                code: this.room,
                options: this.options,
            },
        };
        this.socket?.send(message);
    }

    /**
     * Handle received message
     * @param event
     */
    public handle(message: ServerEvent): void {
        let eventName: string = message.event;
        const args: unknown[] = [];

        switch (message.event) {
            case SERVER_EVENT.JOINED:
                args.push(message.data.id);
                break;
            case SERVER_EVENT.MESSAGE:
                args.push(...message.data.args);
                eventName = message.data.event;

                this.emit(message.event, eventName, ...args, this); // Emit 'lw-message' event on all messages
                break;
        }
        args.push(message);

        this.reserved.emit(message.event, ...args);

        this.emit(eventName, ...args);
    }

    protected setID(id: string): void {
        this.id = id;
    }
}
