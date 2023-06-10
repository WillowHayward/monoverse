import { Injectable } from '@nestjs/common';

import { ClientMessageEventData, CreateEventData, JoinEventData, ReconnectEventData, ERROR_CODE, CloseEventData, LeaveEventData, PingEventData, KickEventData, AdministrateEventData, LocalJoinEventData, LocalLeaveEventData } from '@whc/lipwig/types';
import { generateString } from '@whc/utils';

import { LipwigSocket } from '../app/app.model';
import { Room } from './room';
import { sendError } from './utils';

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
            sendError(user, ERROR_CODE.ROOMNOTFOUND);
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
            sendError(user, ERROR_CODE.ROOMNOTFOUND);
            return;
        }

        return room.reconnect(user, id);
    }

    close(user: LipwigSocket, payload: CloseEventData) {

    }

    leave(user: LipwigSocket, payload: LeaveEventData) {

    }

    administrate(user: LipwigSocket, payload: AdministrateEventData) {

    }

    message(user: LipwigSocket, payload: ClientMessageEventData) {
        const code = user.room;
        const room = this.rooms[code];

        if (!room) {
            // Room not found
            sendError(user, ERROR_CODE.ROOMNOTFOUND);
            return;
        }

        room.handle(user, payload);
    }

    ping(user: LipwigSocket, payload: PingEventData) {

    }

    kick(user: LipwigSocket, payload: KickEventData) {

    }

    localJoin(user: LipwigSocket, payload: LocalJoinEventData) {
        const code = user.room;
        const room = this.rooms[code];

        if (!room) {
            // Room not found
            sendError(user, ERROR_CODE.ROOMNOTFOUND);
            return;
        }

        room.localJoin(user, payload);

    }

    localLeave(user: LipwigSocket, payload: LocalLeaveEventData) {
        const code = user.room;
        const room = this.rooms[code];

        if (!room) {
            // Room not found
            sendError(user, ERROR_CODE.ROOMNOTFOUND);
            return;
        }

        room.localLeave(user, payload);

    }

    disconnect(user: LipwigSocket) {
        const code = user.room;
        const room = this.rooms[code];
        if (room) {
            room.disconnect(user);
        }
    }
}
