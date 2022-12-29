/**
 * @author: WillHayCode
 */
/*import { SocketUser } from './SocketUser';
import { Message, DataMap } from '@whc/lipwig/types';
import { User } from './User';

export class Admin extends SocketUser {
    private options: DataMap;
    constructor(url: string, options: DataMap = {}) {
        super(url);
        this.options = options;
        this.reserved.once('administrating', this.administrating, { object: this });
    }

    private administrating(id: string): void {
        this.setID(id);
    }
    protected handle(event: MessageEvent): void {
      const message: Message = JSON.parse(event.data);
      const args: unknown[] = message.data.args.concat(message);

      this.reserved.emit(message.event, ...args);
      this.emit(message.event, ...args);
    }

    protected connected(): void {
      const message: Message = {
        event: 'administrate',
        data: {
            args: [this.options],
            sender: '',
            recipient: []
        }
      };
      this.sendMessage(message);
    }
    
}*/
