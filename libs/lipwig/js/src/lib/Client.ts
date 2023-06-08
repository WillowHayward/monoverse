/**
 * @author: WillHayCode
 */
import { SocketUser } from './SocketUser';
import {
    JoinEvent,
    LipwigMessageEvent,
    UserOptions,
    ServerEvent,
    CLIENT_EVENT,
    SERVER_EVENT,
} from '@whc/lipwig/types';

export class Client extends SocketUser {
    /**
     * Attempt to join an existing Lipwig room
     * @param url   Websocket url of LipwigCore server
     * @param code  Room code to attempt to join
     * @param data  Data to pass to room host on connection
     */
    constructor(
        url: string,
        private code: string,
        private options: UserOptions = {}
    ) {
        super(url);
        this.room = code;
        this.reserved.on(SERVER_EVENT.JOINED, (id: string) => {
            this.setID(id);
        });
        console.log(this);
    }

    /**
     * Send a message to the host
     * @param event The event name
     * @param args  Arguments to send
     */
    public send(event: string, ...args: unknown[]): void {
        const message: LipwigMessageEvent = {
            event: CLIENT_EVENT.MESSAGE,
            data: {
                event,
                args,
                sender: this.id,
                recipient: [],
            },
        };
        this.sendMessage(message);
    }

    /**
     * Final stage of connection handshake - sends join message to LipwigCore server
     */
    protected connected(): void {
        const message: JoinEvent = {
            event: CLIENT_EVENT.JOIN,
            data: {
                code: this.code,
                options: this.options,
            },
        };
        this.sendMessage(message);
    }

    /**
     * Handle received message
     * @param event
     */
    public handle(event: MessageEvent): void {
        const message: ServerEvent = JSON.parse(event.data);

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
}
