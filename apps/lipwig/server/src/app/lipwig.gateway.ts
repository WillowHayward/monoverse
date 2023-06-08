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
} from '@whc/lipwig/types';
import { generateString } from '@whc/utils';
import { Room } from './room';
import { CLIENT_EVENT } from '@whc/lipwig/types';

@WebSocketGateway()
export class LipwigGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private rooms: { [code: string]: Room } = {};

    @SubscribeMessage(CLIENT_EVENT.CREATE)
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

    @SubscribeMessage(CLIENT_EVENT.JOIN)
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

    @SubscribeMessage(CLIENT_EVENT.RECONNECT)
    handleReconnect(user: LipwigSocket, payload: ReconnectEventData) {
        const code = payload.code;
        const id = payload.id;

        const room = this.rooms[code];
        room.reconnect(user, id);
    }

    @SubscribeMessage(CLIENT_EVENT.ADMINISTRATE)
    handleAdmin(user: LipwigSocket, payload: AdministrateEventData) {
        // stub
    }

    @SubscribeMessage(CLIENT_EVENT.MESSAGE)
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
