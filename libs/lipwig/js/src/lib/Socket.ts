import { ClientEvent, ServerEvent } from "@whc/lipwig/types";
import { EventManager } from "./EventManager";

export class Socket extends EventManager {
    private socket: WebSocket;
    private retry: boolean;
    constructor(private url: string) {
        super();
        this.url = url;

        this.socket = new WebSocket(url);
        this.retry = false;
        //TODO: Make this an option on creation
        this.addListeners();
    }

    private addListeners(): void {
        this.socket.addEventListener('open', () => {
            this.emit('connected');
        });
        this.socket.addEventListener('error', () => {
            this.emit('error');
            // TODO: error handling
        });
        this.socket.addEventListener('message', (event: MessageEvent) => {
            const message: ServerEvent = JSON.parse(event.data);
            this.emit('message', message);
            //console.log(event);
            //this.handle(event);
        });
        this.socket.addEventListener('close', () => {
            if (this.retry) {
                // TODO
                //this.autoReconnect();
            }
            const newSocket = null;
            this.emit('reconnected', newSocket);
            // TODO: This is a stub - connection close handling
        });
    }

    public send(message: ClientEvent): void {
        //TODO: Add in contingency system for messages sent during a disconnection
        //CONT: A queue of messages to be sent in bulk on resumption of connection
        //CONT: Possible return unsent messages from this method
        this.socket.send(JSON.stringify(message));
    }
}
