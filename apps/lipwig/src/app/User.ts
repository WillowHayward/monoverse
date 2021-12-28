/**
 * @author: WillHayCode
 */
import * as WebSocket from 'websocket';
import { Message } from './Types';

export class User {
    private id: string;
    private socket: WebSocket.connection;
    private queue: Message[] = [];
    constructor(id: string, socket: WebSocket.connection) {
        this.id = id;

        if (socket === null) {
            throw new TypeError("User must have socket");
        }
        this.socket = socket;

        this.socket.on('close', (): void => {
            this.socket.removeAllListeners();
        });

    }

    public getID(): string {
        return this.id;
    }

    public getSocket(): WebSocket.connection {
        return this.socket;
    }

    public send(message: Message): void {
        message.recipient = [this.id];
        const text: string = JSON.stringify(message);
        console.log(text);
        if (this.socket === null) {
            this.queue.push(message);
            console.log('Queued Message', text);
            return;
        }
        this.socket.sendUTF(text);
    }

    public reconnect(socket: WebSocket.connection): void {
        this.socket = socket;

        const reconnect: Message = {
            event: 'reconnected',
            data: [],
            sender: '',
            recipient: [this.id]
        };

        this.send(reconnect);

        this.queue.forEach((message: Message): void => {
            this.send(message);
        });

        this.queue = [];
    }

    public close(): void {
        this.socket.close();
    }

    public equals(socket: WebSocket.connection): boolean {
        return this.socket === socket;
    }
}
