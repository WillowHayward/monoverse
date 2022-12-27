import { v4 } from 'uuid';
import { SERVER_EVENT, GenericEvent, CreatedEvent, JoinedEvent, LipwigMessageEventData } from '@willhaycode/lipwig/types';
import { LipwigSocket } from './lipwig.model';

export class Room {
  private users: string[] = []; // Array of user ids, index 0 for host
  private connected: { [id: string]: LipwigSocket } = {};
  private disconnected: string[] = [];

  constructor(private host: LipwigSocket, public code: string) {
    this.initialiseUser(host, true);
    const confirmation: CreatedEvent = {
        event: SERVER_EVENT.CREATED,
        data: {
            code,
            id: host.id
        }
    }

    this.sendMessage(host, confirmation);
  }

  join(client: LipwigSocket) { // TODO: Join data
    this.initialiseUser(client, false);
    const id = client.id;
    this.connected[id] = client;

    const confirmation: JoinedEvent = {
        event: SERVER_EVENT.JOINED,
        data: {
            id
        }
    }

    this.sendMessage(client, confirmation);
  }

  disconnect(user: LipwigSocket, permanent: boolean) {
    if (permanent) {
      // Delete from room
    }

    const id = user.id;
    delete this.connected[id];
    this.disconnected.push(id);
  }

  reconnect(user: LipwigSocket, id: string) {
    const disconnectedIndex = this.disconnected.indexOf(id);
    if (disconnectedIndex === -1) {
        return;
    }

    if (this.users[0] === id) {
        this.host = user;
    } else {
        this.connected[id] = user;
    }

    this.disconnected.splice(disconnectedIndex, 1);
  }

  handleMessage(user: LipwigSocket, data: LipwigMessageEventData) {
      if (user.id !== this.users[0]) { // If not host
          this.sendMessage(this.host, {
              event: 'message',
                data
          });
          return;
      }

      for (const id of data.recipient) {
          //TODO: Disconnected message queuing
          const user = this.connected[id];
          if (!user) {
              // stub
          }

          this.sendMessage(user, {
            event: 'message',
            data
          });
          return;
      }


  }

  private sendMessage(user: LipwigSocket, message: GenericEvent) {
      const messageString = JSON.stringify(message);
      user.send(messageString);
  }

  private initialiseUser(user: LipwigSocket, host: boolean, id?: string) {
    user.host = host;
    user.room = this.code;
    user.id = id || v4();
    this.users.push(user.id);
  }
}
