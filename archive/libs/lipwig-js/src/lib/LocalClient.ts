/**
 * @author: WillHayCode
 */
import { EventManager } from '@willhaycode/event-manager';
import { User } from './User';
import { Host } from './Host';
import { Message, DataMap } from '@willhaycode/lipwig/types';

export class LocalClient extends EventManager {
  public id: string;
  private reserved: EventManager;
  private parent: Host;
  public data: DataMap;
  private user: User;
  constructor(parent: Host, user: User, data: DataMap = {}) {
    super();
    this.id = '';
    this.parent = parent;
    this.user = user;
    this.data = data;
    this.reserved = new EventManager();
    this.reserved.on('joined', this.setID, {object: this});
  }

  public send(event: string, ...args: unknown[]): void {
    this.parent.emit(event, this.user, ...args);
  }

  public handle(message: Message): void {
    // In theory this should never be from a socket
    const args: unknown[] = message.data.args.concat(message);

    this.reserved.emit(message.event, ...args);
    this.emit(message.event, ...args);
  }

  private setID(id: string): void {
    this.id = id;
  }
}
