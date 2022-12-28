import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { LipwigSocket } from './lipwig.model';
import {
    CreateEventData,
    JoinEventData,
    ReconnectEventData,
    AdministrateEventData,
    LipwigMessageEventData,
} from '@willhaycode/lipwig/types';
import { generateString } from '@willhaycode/utils';
import { Room } from './room';

@WebSocketGateway()
export class LipwigGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private rooms: { [code: string]: Room } = {};

    @SubscribeMessage('create')
    handleCreate(user: LipwigSocket, payload: CreateEventData) {
        const existingCodes = Object.keys(this.rooms);
        let code: string;
        do {
            code = generateString(4);
        } while (existingCodes.includes(code));
        const config = payload.config;
        const room = new Room(user, code, config);
        this.rooms[code] = room;
    }

    @SubscribeMessage('join')
    handleJoin(user: LipwigSocket, payload: JoinEventData) {
        console.log(payload);
        const code = payload.code;
        const options = payload.options;
        // TODO: Join Options
        const room = this.rooms[code];

        if (!room) {
            // Room not found
        }

        room.join(user, options);
    }

    @SubscribeMessage('reconnect')
    handleReconnect(user: LipwigSocket, payload: ReconnectEventData) {
        const code = payload.code;
        const id = payload.id;

        const room = this.rooms[code];
        room.reconnect(user, id);
    }

    @SubscribeMessage('administrate')
    handleAdmin(user: LipwigSocket, payload: AdministrateEventData) {
        // stub
    }

    @SubscribeMessage('message')
    handleMessage(user: LipwigSocket, payload: LipwigMessageEventData) {
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
