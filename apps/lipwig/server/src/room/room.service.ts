import { Injectable, Logger } from '@nestjs/common';

import { ClientMessageEventData, CreateEventData, JoinEventData, ReconnectEventData, ErrorEvent, SERVER_EVENT, ERROR_CODE } from '@whc/lipwig/types';
import { generateString } from '@whc/utils';

import { LipwigSocket } from '../app/app.model';
import { Room } from './room';

@Injectable()
export class RoomService {
    private rooms: { [code: string]: Room } = {};

    create(user: LipwigSocket, payload: CreateEventData) {
        const config = payload.config;
        const existingCodes = Object.keys(this.rooms);

        if (config.reconnect && existingCodes.includes(config.reconnect.code)) {
            if (this.reconnect(user, config.reconnect)) {
                return;
            }
        }
        let code: string;
        do {
            code = generateString(4);
        } while (existingCodes.includes(code));
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
            const message: ErrorEvent = {
                event: SERVER_EVENT.ERROR,
                data: {
                    error: ERROR_CODE.ROOMNOTFOUND
                }
            }
            user.send(JSON.stringify(message));
            return;
        }

        if (options.reconnect) {
            if (room.reconnect(user, options.reconnect)) {
                return;
            }
        }


        room.join(user, options);
    }

    reconnect(user: LipwigSocket, payload: ReconnectEventData): boolean {
        const code = payload.code;
        const id = payload.id;

        const room = this.rooms[code];
        if (!room) {
            Logger.log(`Room ${code} not found`);

            return;
        }
        return room.reconnect(user, id);
    }

    message(user: LipwigSocket, payload: ClientMessageEventData) {
        const code = user.room;
        const room = this.rooms[code];

        if (!room) {
            // Room not found
            console.log(code, 'not found');
            return;
        }

        room.handleMessage(user, payload);
    }

    disconnect(user: LipwigSocket) {
        const code = user.room;
        const room = this.rooms[code];
        if (room) {
            room.disconnect(user, false);
        }
    }
}
