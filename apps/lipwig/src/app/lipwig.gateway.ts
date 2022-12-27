import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { LipwigSocket } from './lipwig.model';
import { MessageData } from '@willhaycode/lipwig/types';
import { generateString } from '@willhaycode/utils';
import { Room } from './room';

@WebSocketGateway()
export class LipwigGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private rooms: { [code: string]: Room } = {};

  @SubscribeMessage('create')
  handleCreate(user: LipwigSocket, payload: MessageData) {
    const existingCodes = Object.keys(this.rooms);
    let code: string;
    do {
      code = generateString(4);
    } while (existingCodes.includes(code));
    const room = new Room(user, code);
    this.rooms[code] = room;
  }

  @SubscribeMessage('join')
  handleJoin(user: LipwigSocket, payload: MessageData) {
      console.log(payload);
    const code = payload.args[0] as string; // TODO: Type Checking
    const room = this.rooms[code];

    if (!room) {
      // Room not found
    }

    room.join(user);
  }

  @SubscribeMessage('reconnect')
  handleReconnect(user: LipwigSocket, payload: MessageData) {
    const code = payload.args[0] as string; // TODO: Type Checking
    const id = payload.args[1] as string; // TODO: Type Checking

    const room = this.rooms[code];
    room.reconnect(user, id);
  }

  @SubscribeMessage('admin')
  handleAdmin(user: LipwigSocket, payload: MessageData) {
    // stub
  }

  @SubscribeMessage('message')
  handleMessage(user: LipwigSocket, payload: MessageData) {
      const code = user.room;
      const room = this.rooms[code];

      if (!room) {
          // Room not found
      }

      room.handleMessage(user, payload);
      
  }

  handleConnection(user: LipwigSocket) {
    //console.log(user);
  }

  handleDisconnect(user: LipwigSocket) {
    const code = user.room;
    const room = this.rooms[code];
    room.disconnect(user, false);
  }
}
