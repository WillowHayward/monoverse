import { Injectable } from '@nestjs/common';

import {
    ERROR_CODE,
    ClientEvents,
    HostEvents,
    RoomConfig,
    UserOptions
} from '@whc/lipwig/model';

import { generateString } from '@whc/utils';

import { LipwigSocket } from '../app/app.model';
import { Room } from './room';

// TODO: Make @Room param decorator
// TODO: Move all the room checking to guard
// TODO: Make @SubscribeHostEvent and @SubscribeClientEvent method decorators
// TODO: Make exception which sends error?
@Injectable()
export class RoomService {
    private rooms: { [code: string]: Room } = {};

    getRoom(room: string): Room {
        return this.rooms[room];
    }

    roomExists(room: string): boolean {
        if (this.getRoom(room)) {
            return true;
        }

        return false;
    }

    userInRoom(room: string, id: string): boolean {
        return this.getRoom(room).inRoom(id);
    }

    userIsHost(room: string, id: string): boolean {
        return this.getRoom(room).isHost(id);
    }

    create(user: LipwigSocket, config: RoomConfig) {
        const existingCodes = Object.keys(this.rooms);

        if (config.reconnect && existingCodes.includes(config.reconnect.code)) {
            if (this.reconnect(user, config.reconnect.code, config.reconnect.id)) {
                return;
            }
        }
        let code: string;
        do {
            code = generateString(4);
        } while (existingCodes.includes(code));
        const room = new Room(user, code, config);
        this.rooms[code] = room;
        room.onclose = () => {
            console.log(code, 'closed');
            delete this.rooms[code];
        }
    }

    join(user: LipwigSocket, code: string, options?: UserOptions) {
        // TODO: Join Options
        const room = this.rooms[code];

        if (!room) {
            // Room not found
            user.sendError(ERROR_CODE.ROOMNOTFOUND);
            return;
        }

        if (options.reconnect) {
            if (room.reconnect(user, options.reconnect)) {
                return;
            }
        }

        room.join(user, options);
    }

    reconnect(user: LipwigSocket, code: string, id: string): boolean {
        const room = this.rooms[code];
        if (!room) {
            user.sendError(ERROR_CODE.ROOMNOTFOUND);
            return;
        }

        return room.reconnect(user, id);
    }

    //administrate(user: LipwigSocket, payload: AdministrateEventData) {}

    message(user: LipwigSocket, payload: HostEvents.MessageData | ClientEvents.MessageData) {
        const code = user.room;
        const room = this.rooms[code];

        if (!room) {
            // Room not found
            user.sendError(ERROR_CODE.ROOMNOTFOUND);
            return;
        }

        room.handle(user, payload);
    }

    pingHost(user: LipwigSocket, time: number) {
        const code = user.room;
        const room = this.rooms[code];

        if (!room) {
            // Room not found
            user.sendError(ERROR_CODE.ROOMNOTFOUND);
            return;
        }
        room.pingHost(user, time);
    }

    pongHost(user: LipwigSocket, time: number, id: string) {
        const code = user.room;
        const room = this.rooms[code];

        if (!room) {
            // Room not found
            user.sendError(ERROR_CODE.ROOMNOTFOUND);
            return;
        }
        room.pongHost(user, time, id);
    }

    pingClient(user: LipwigSocket, time: number, id: string) {
        const code = user.room;
        const room = this.rooms[code];

        if (!room) {
            // Room not found
            user.sendError(ERROR_CODE.ROOMNOTFOUND);
            return;
        }
        room.pingClient(user, time, id);
    }

    pongClient(user: LipwigSocket, time: number) {
        const code = user.room;
        const room = this.rooms[code];

        if (!room) {
            // Room not found
            user.sendError(ERROR_CODE.ROOMNOTFOUND);
            return;
        }
        room.pongClient(user, time);
    }

    kick(user: LipwigSocket, id: string, reason?: string) {
        const code = user.room;
        const room = this.rooms[code];

        if (!room) {
            // Room not found
            user.sendError(ERROR_CODE.ROOMNOTFOUND);
            return;
        }

        room.kick(user, id, reason);
    }

    localJoin(user: LipwigSocket) {
        const code = user.room;
        const room = this.rooms[code];

        if (!room) {
            // Room not found
            user.sendError(ERROR_CODE.ROOMNOTFOUND);
            return;
        }

        room.localJoin(user);
    }

    localLeave(user: LipwigSocket) {
        const code = user.room;
        const room = this.rooms[code];

        if (!room) {
            // Room not found
            user.sendError(ERROR_CODE.ROOMNOTFOUND);
            return;
        }

        room.localLeave(user);
    }

    disconnect(user: LipwigSocket) {
        const code = user.room;
        const room = this.rooms[code];
        if (room) {
            room.disconnect(user);
        }
    }
}
