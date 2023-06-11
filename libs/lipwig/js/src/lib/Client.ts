/**
 * @author: WillHayCode
 */
import {
    CLIENT_EVENT,
    SERVER_CLIENT_EVENT,
    ClientEvents,
    ServerClientEvents,
    UserOptions
} from '@whc/lipwig/model';
import { EventManager } from './EventManager';
import { Socket } from './Socket';

export class Client extends EventManager {
    private socket?: Socket;
    public room: string;
    public id = '';

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

        this.socket.on('message', (message: ServerClientEvents.Event) => {
            this.handle(message);
        });

        this.socket.on('disconnected', () => {
            this.emit('disconnected');
        });

        this.socket.on('kicked', (reason?: string) => {
            this.handle({
                event: SERVER_CLIENT_EVENT.KICKED,
                data: {
                    reason
                }
            });
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
        const message: ClientEvents.Message = {
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
        const message: ClientEvents.Join = {
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
    public handle(message: ServerClientEvents.Event): void {
        let eventName: string = message.event;
        const args: unknown[] = [];

        switch (message.event) {
            case SERVER_CLIENT_EVENT.JOINED:
                this.id = message.data.id;
                args.push(message.data.id);

                this.socket?.setData(this.room, this.id);
                break;
            case SERVER_CLIENT_EVENT.MESSAGE:
                args.push(...message.data.args);
                eventName = message.data.event;

                this.emit(message.event, eventName, ...args, this); // Emit 'lw-message' event on all messages
                break;
            case SERVER_CLIENT_EVENT.RECONNECTED:
                this.id = message.data.id;
                break;
            case SERVER_CLIENT_EVENT.ERROR:
                args.push(message.data.error);
                args.push(message.data.message);
                break;
            case SERVER_CLIENT_EVENT.KICKED:
                args.push(message.data.reason);
                break;
            case SERVER_CLIENT_EVENT.HOST_DISCONNECTED:
                break;
            case SERVER_CLIENT_EVENT.HOST_RECONNECTED:
                break;
        }
        args.push(message);

        this.emit(eventName, ...args);
    }
}
