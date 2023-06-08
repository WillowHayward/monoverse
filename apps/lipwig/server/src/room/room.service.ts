import { Injectable } from '@nestjs/common';

import { ClientMessageEventData, CreateEventData, JoinEventData, ReconnectEventData } from '@whc/lipwig/types';
import { generateString } from '@whc/utils';

import { LipwigSocket } from '../app/app.model';
import { Room } from './room';

@Injectable()
export class RoomService {
    private rooms: { [code: string]: Room } = {};

    create(user: LipwigSocket, payload: CreateEventData) {
        const existingCodes = Object.keys(this.rooms);
        let code: string;
        do {
            code = generateString(4);
        } while (existingCodes.includes(code));
        const config = payload.config;
        const room = new Room(user, code, config);
        this.rooms[code] = room;
    }

    join(user: LipwigSocket, payload: JoinEventData) {
        const code = payload.code;
        const options = payload.options;
        // TODO: Join Options
        const room = this.rooms[code];

        if (!room) {
            // Room not found
        }

        room.join(user, options);
    }

    reconnect(user: LipwigSocket, payload: ReconnectEventData) {
        const code = payload.code;
        const id = payload.id;

        const room = this.rooms[code];
        room.reconnect(user, id);
    }

    message(user: LipwigSocket, payload: ClientMessageEventData) {
        const code = user.room;
        const room = this.rooms[code];

        if (!room) {
            // Room not found
        }

        room.handleMessage(user, payload);
    }

    disconnect(user: LipwigSocket) {
        const code = user.room;
        const room = this.rooms[code];
        room.disconnect(user, false);
    }
}
