/**
 * @author: WillHayCode
 */
import { SocketUser } from './SocketUser';
import { JoinEvent, CLIENT_EVENT, LipwigMessageEvent, UserOptions } from '@willhaycode/lipwig/types';

export class Client extends SocketUser {
    /**
     * Attempt to join an existing Lipwig room
     * @param url   Websocket url of LipwigCore server
     * @param code  Room code to attempt to join
     * @param data  Data to pass to room host on connection
     */
    constructor(url: string, private code: string, private options: UserOptions = {}) {
      super(url);
      this.reserved.on('joined', this.setID, {object: this});
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
            recipient: []
        }
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
        }
      };
      this.sendMessage(message);
    }

    /**
     * Handle received message
     * @param event 
     */
    public handle(event: MessageEvent): void {
      const message: LipwigMessageEvent = JSON.parse(event.data);
        console.log('client message received', message);
      const args: unknown[] = message.data.args.concat(message);

      this.reserved.emit(message.event, ...args);
      
      if (!message.data.event) {
          message.data.event = message.event;
      }
        this.emit(message.data.event, ...args);
    }
}
