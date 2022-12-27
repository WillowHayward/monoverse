import { v4 } from 'uuid';
import type { Message } from '@willhaycode/lipwig-js';
import { LipwigSocket } from './lipwig.model';

export class Room {
  private users: string[]; // Array of user ids
  private connected: { [id: string]: LipwigSocket } = {};
  private disconnected: string[];

  constructor(private host: LipwigSocket, public code: string) {
    this.initialiseUser(host, true);
    const confirmation: Message = {
        event: 'created',
        data: [code],
        sender: '',
        recipient: []
    }

    this.sendMessage(host, confirmation);
  }

  join(client: LipwigSocket) {
    this.initialiseUser(client, false);
    const id = client.id;
    this.connected[id] = client;
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

  handleMessage(user: LipwigSocket, message: Message) {
    // stub
  }

  private sendMessage(user: LipwigSocket, message: Message) {
      const messageString = JSON.stringify(message);
      user.send(messageString);
  }

  private initialiseUser(client: LipwigSocket, host: boolean, id?: string) {
    client.host = host;
    client.room = this.code;
    client.id = id || v4();
  }
}
