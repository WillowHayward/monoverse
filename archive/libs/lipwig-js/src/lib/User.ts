/**
 * @author: WillHayCode
 */
import { EventManager } from '@willhaycode/event-manager';
import { Host } from './Host';
import { LocalClient } from './LocalClient';
import { Message } from '@willhaycode/lipwig/types';

export class User extends EventManager {
    public id: string;
    private parent: Host;
    public local: boolean;
    public client: LocalClient | undefined;
    constructor(id: string, parent: Host, local = false) {
      super();
      this.id = id;
      this.parent = parent;
      this.local = local;
    }

    public send(event: string, ...args: unknown[]): void {
      const message: Message = {
        event: 'message',
        data: {
            event,
            args,
            sender: this.parent.id,
            recipient: [this.id]
        }
      };

      if (this.local) {
        this.client?.handle(message);
      } else {
        this.parent.sendMessage(message);
      }
    }

    public assign(name: string): void {
      this.parent.assign(this, name);
    }

    public unassign(name: string): void {
      this.parent.unassign(this, name);
    }

    public kick(reason = ''): void {
      // TODO: For a local client this won't quite work I believe
      this.send('kick', this.id, reason);
    }
}
