/**
 * @author: WillHayCode
 */
import { SocketUser } from './SocketUser';
import { Message, DataMap } from './Types';

export class Client extends SocketUser {
    private code: string;
    private data: DataMap;
    
    /**
     * Attempt to join an existing Lipwig room
     * @param url   Websocket url of LipwigCore server
     * @param code  Room code to attempt to join
     * @param data  Data to pass to room host on connection
     */
    constructor(url: string, code: string, data: DataMap = {}) {
      super(url);
      this.reserved.on('joined', this.setID, {object: this});
      this.code = code;
      this.data = data;
    }

    /**
     * Send a message to the host
     * @param event The event name
     * @param args  Arguments to send
     */
    public send(event: string, ...args: unknown[]): void { 
      const message: Message = {
        event: event,
        data: args,
        sender: this.id,
        recipient: []
      };
      this.sendMessage(message);
    }

    /**
     * Final stage of connection handshake - sends join message to LipwigCore server
     */
    protected connected(): void {
      const message: Message = {
        event: 'join',
        data: [this.code, this.data],
        sender: '',
        recipient: []
      };
      this.sendMessage(message);
    }

    /**
     * Handle received message
     * @param event 
     */
    public handle(event: MessageEvent): void {
      const message: Message = JSON.parse(event.data);
      const args: unknown[] = message.data.concat(message);

      this.reserved.emit(message.event, ...args);
      this.emit(message.event, ...args);
    }
}
