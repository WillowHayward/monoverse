/**
 * @author: WillHayCode
 */
import {
    CLIENT_EVENT,
    SERVER_CLIENT_EVENT,
    CLOSE_CODE,
    ClientEvents,
    ServerClientEvents,
    UserOptions,
} from '@whc/lipwig/model';
import { EventManager } from './EventManager';
import { Socket } from './Socket';
import * as Logger from 'loglevel';

export class Client extends EventManager {
    protected name = 'Client';
    private socket: Socket;
    public id = '';

    /**
     * Attempt to join an existing Lipwig room
     * @param url   Websocket url of LipwigCore server
     * @param code  Room code to attempt to join
     * @param data  Data to pass to room host on connection
     */
    constructor(
        url: string,
        public room: string,
        public options: UserOptions = {}
    ) {
        super();

        this.socket = new Socket(url, this.name);

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
            Logger.debug(`[${this.name}] Disconnected`);
            this.emit('disconnected');
        });

        this.socket.on('kicked', (reason?: string) => {
            if (reason) {
                Logger.debug(`[${this.name}] Kicked - ${reason}`);
            } else {
                Logger.debug(`[${this.name}] Kicked`);
            }
            this.emit('kicked', reason);
        });

        this.socket.on('closed', (reason?: string) => {
            if (reason) {
                Logger.debug(`[${this.name}] Room closed - ${reason}`);
            } else {
                Logger.debug(`[${this.name}] Room closed`);
            }
            this.emit('closed', reason);
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
        this.socket.send(message);
    }

    public leave(reason?: string) {
        this.socket.close(CLOSE_CODE.LEFT, reason);
    }

    public ping(full: boolean = true): Promise<number> {
        const now = (new Date()).getTime();

        if (full) {
            // Round trip to host
            return this.pingHost(now);
        } else {
            // Just server
            return this.pingServer(now);
        }
    }

    private pingServer(time: number): Promise<number> {
        const promise = new Promise<number>(resolve => {
            this.once(SERVER_CLIENT_EVENT.PONG_SERVER, ping => {
                resolve(ping);
            });
        });
        this.socket.send({
            event: CLIENT_EVENT.PING_SERVER,
            data: {
                time
            }
        });

        return promise;
    }

    private pingHost(time: number): Promise<number> {
        const promise = new Promise<number>(resolve => {
            this.once(SERVER_CLIENT_EVENT.PONG_HOST, ping => {
                resolve(ping);
            });
        });
        this.socket.send({
            event: CLIENT_EVENT.PING_HOST,
            data: {
                time
            }
        });
        return promise;
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
        this.socket.send(message);
    }

    /**
     * Handle received message
     * @param event
     */
    public handle(message: ServerClientEvents.Event): void {
        Logger.debug(`[${this.name}] Received '${message.event}' event`);
        let eventName: string = message.event;
        const args: unknown[] = [];

        switch (message.event) {
            case SERVER_CLIENT_EVENT.JOINED:
                Logger.debug(`[${this.name}] Joined ${this.room}`);
                this.id = message.data.id;
                args.push(message.data.id);

                this.socket.setData(this.room, this.id);
                break;
            case SERVER_CLIENT_EVENT.MESSAGE:
                Logger.debug(`[${this.name}] Received '${message.data.event}' message`);
                args.push(...message.data.args);
                eventName = message.data.event;

                this.emit(message.event, eventName, ...args, this); // Emit 'lw-message' event on all messages
                break;
            case SERVER_CLIENT_EVENT.RECONNECTED:
                Logger.debug(`[${this.name}] Reconnected`);
                this.id = message.data.id;
                break;
            case SERVER_CLIENT_EVENT.ERROR:
                if (message.data.message) {
                    Logger.warn(`[${this.name}] Received error ${message.data.error} - ${message.data.message}`);
                } else {
                    Logger.warn(`[${this.name}] Received error ${message.data.error}`);
                }
                args.push(message.data.error);
                args.push(message.data.message);
                break;
            case SERVER_CLIENT_EVENT.HOST_DISCONNECTED:
                Logger.debug(`[${this.name}] Host Disconnected`);
                break;
            case SERVER_CLIENT_EVENT.HOST_RECONNECTED:
                Logger.debug(`[${this.name}] Host Reconnected`);
                break;
            case SERVER_CLIENT_EVENT.PING_CLIENT:
                this.socket.send({
                    event: CLIENT_EVENT.PONG_CLIENT,
                    data: {
                        time: message.data.time
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
        args.push(message);

        this.emit(eventName, ...args);
    }
}
