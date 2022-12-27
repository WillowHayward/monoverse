import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { LipwigSocket } from './lipwig.model';
import { Message } from '@willhaycode/lipwig-js';
import { generateString } from '@willhaycode/utils';
import { Room } from './room';

@WebSocketGateway()
export class LipwigGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private rooms: {[code: string]: Room };

    @SubscribeMessage('create')
    handleCreate(user: LipwigSocket, payload: Message) {
        const existingCodes = Object.keys(this.rooms);
        let code: string;
        do {
            code = generateString(4);
        } while (existingCodes.includes(code));
        const room = new Room(user, code);
        this.rooms[code] = room;
    }

    @SubscribeMessage('join')
    handleJoin(user: LipwigSocket, payload: Message) {
        const code = payload.data[0] as string; // TODO: Type Checking
        const room = this.rooms[code];

        if (!room) {
            // Room not found
        }

        room.join(user);
    }

    @SubscribeMessage('reconnect')
    handleReconnect(user: LipwigSocket, payload: Message) {
        const code = payload.data[0] as string; // TODO: Type Checking
        const id = payload.data[1] as string; // TODO: Type Checking

        const room = this.rooms[code];
        room.reconnect(user, id);
    }

    @SubscribeMessage('admin')
    handleAdmin(user: LipwigSocket, payload: Message) {
        // stub
    }

    @SubscribeMessage('message')
    handleMessage(user: LipwigSocket, payload: Message) {
        // stub
    }

    handleConnection(user: LipwigSocket) {
        console.log(user);
    }

    handleDisconnect(user: LipwigSocket) {
        const code = user.room;
        const room = this.rooms[code];
        room.disconnect(user, false);
    }
}
