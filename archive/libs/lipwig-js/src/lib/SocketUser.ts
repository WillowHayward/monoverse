/**
 * @author: WillHayCode
 */
import { EventManager } from '@willhaycode/event-manager';
import { Message } from '@willhaycode/lipwig/types';

export abstract class SocketUser extends EventManager {
    public id: string;
    protected reserved: EventManager;
    private socket: WebSocket;
    private retry: boolean;
    private url: string;
    constructor(url: string) {
      super();
      this.url = url;
      this.id = '';
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
      const message: Message = {
        event: 'reconnect',
        data: {
            args: [this.id],
            sender: this.id,
            recipient: []
        }
      };
      this.sendMessage(message);
    }

    public sendMessage(message: Message): void {
      //TODO: Add in contingency system for messages sent during a disconnection
      //CONT: A queue of messages to be sent in bulk on resumption of connection
      if (message.data.sender.length === 0) {
        message.data.sender = this.id;
      }
      console.log(message);
      this.socket.send(JSON.stringify(message));
    }

    public ping(): void {
      const now: number = new Date().getTime();
      const message: Message = {
        event: 'lw-ping',
        data: {
            args: [now],
            recipient: [],
            sender: ''
        }
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
}
