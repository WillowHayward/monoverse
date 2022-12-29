/**
 * @author: WillHayCode
 */
import { SocketUser } from './SocketUser';
import {
    JoinEvent,
    CLIENT_EVENT,
    LipwigMessageEvent,
    UserOptions,
    ServerEvent,
    SERVER_EVENT,
    JoinedEvent,
} from '@willhaycode/lipwig/types';

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
        this.reserved.on('joined', this.setID, { object: this });
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
                const joined = message as JoinedEvent;
                args.push(joined.data.id);
                break;
            case SERVER_EVENT.MESSAGE:
                const msg = message as LipwigMessageEvent;
                args.push(...msg.data.args);
                eventName = msg.data.event;

                this.emit(message.event, eventName, ...args, this); // Emit 'message' event on all messages
                break;
        }
        args.push(message);

        this.reserved.emit(message.event, ...args);

        this.emit(eventName, ...args);
    }
}
