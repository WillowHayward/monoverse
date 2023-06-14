import { Injectable } from '@nestjs/common';

import {
    ERROR_CODE,
    ClientEvents,
    HostEvents,
    CreateOptions,
    JoinOptions
} from '@whc/lipwig/model';

import { generateString } from '@whc/utils';

import { LipwigSocket } from '../classes/LipwigSocket';
import { Room } from '../classes/Room';

// TODO: Make @SubscribeHostEvent and @SubscribeClientEvent method decorators
// TODO: Make exception which sends error?
@Injectable()
export class RoomService {
    private rooms: { [code: string]: Room } = {};
    private roomLimit: number = 0; // 0 for no limit

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

    create(user: LipwigSocket, config: CreateOptions) {
        const existingCodes = Object.keys(this.rooms);

        if (config.reconnect && existingCodes.includes(config.reconnect.code)) {
            if (this.reconnect(user, config.reconnect.code, config.reconnect.id)) {
                return;
            }
        }

        if (this.roomLimit) {
            if (existingCodes.length >= this.roomLimit) {
                // TODO: Implement room limit
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
            delete this.rooms[code];
        }
    }

    join(user: LipwigSocket, code: string, options?: JoinOptions) {
        // TODO: Join Options
        const room = this.getRoom(code);

        if (!room) {
            user.error(ERROR_CODE.ROOMNOTFOUND);
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
        const room = this.getRoom(code);

        return room.reconnect(user, id);
    }

    //administrate(user: LipwigSocket, payload: AdministrateEventData) {}

    message(user: LipwigSocket, payload: HostEvents.MessageData | ClientEvents.MessageData) {
        const room = user.room;
        room.handle(user, payload);
    }

    pingHost(user: LipwigSocket, time: number) {
        const room = user.room;
        room.pingHost(user, time);
    }

    pongHost(user: LipwigSocket, time: number, id: string) {
        const room = user.room;
        room.pongHost(user, time, id);
    }

    pingClient(user: LipwigSocket, time: number, id: string) {
        const room = user.room;
        room.pingClient(user, time, id);
    }

    pongClient(user: LipwigSocket, time: number) {
        const room = user.room;
        room.pongClient(user, time);
    }

    kick(user: LipwigSocket, id: string, reason?: string) {
        const room = user.room;
        room.kick(user, id, reason);
    }

    localJoin(user: LipwigSocket, id: string) {
        const room = user.room;
        room.localJoin(user, id);
    }

    localLeave(user: LipwigSocket, id: string) {
        const room = user.room;
        room.localLeave(user, id);
    }
}
