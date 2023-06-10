import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RoomService } from './room.service';
import { LipwigSocket } from '../app/app.model';
import { sendError } from './utils';
import { AdministrateEventData, CLIENT_EVENT, ClientMessageEventData, CloseEventData, CreateEventData, ERROR_CODE, JoinEventData, KickEventData, LeaveEventData, PingEventData, ReconnectEventData, SERVER_EVENT } from '@whc/lipwig/types';

@Injectable()
export class RoomGuard implements CanActivate {
    private socket: LipwigSocket;
    constructor(private reflector: Reflector, private rooms: RoomService) {}

    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        this.socket = context.switchToWs().getClient();
        const event = this.reflector.get<string>('message', context.getHandler());
        if (!this.isValidEvent(event)) {
            sendError(this.socket, ERROR_CODE.MALFORMED, `Invalid event '${event}'`);
            return false;
        }

        const args: any = context.getArgs()[1];

        switch (event) {
            case CLIENT_EVENT.CREATE:
                return this.validateCreate(args);
            case CLIENT_EVENT.JOIN:
                return this.validateJoin(args);
            case CLIENT_EVENT.RECONNECT:
                return this.validateReconnect(args);
            case CLIENT_EVENT.CLOSE:
                return this.validateClose(args);
            case CLIENT_EVENT.LEAVE:
                return this.validateLeave(args);
            case CLIENT_EVENT.ADMINISTRATE:
                return this.validateAdministrate(args);
            case CLIENT_EVENT.MESSAGE:
                return this.validateMessage(args);
            case CLIENT_EVENT.PING:
                return this.validatePing(args);
            case CLIENT_EVENT.KICK:
                return this.validateKick(args);
            default:
                sendError(this.socket, ERROR_CODE.MALFORMED, `Guard not set up for event '${event}'`);
                break;
        }

        return true;
    }

    private isValidEvent(event: string): event is CLIENT_EVENT {
        const events = Object.values(CLIENT_EVENT);
        return events.includes(event as CLIENT_EVENT);
    }

    private validateRoomExists(room: string): boolean {
        if (!room || !this.rooms.roomExists(room)) {
            sendError(this.socket, ERROR_CODE.ROOMNOTFOUND);
            return false;
        }

        return true;
    }

    private userIsHost(): boolean {
        return this.rooms.userIsHost(this.socket.room, this.socket.id);
    }

    private validateParameters(args: any, required: string[]): boolean {
        const params = Object.keys(args);
        const missing = required.filter(param => !params.includes(param));

        if (missing.length) {
            sendError(this.socket, ERROR_CODE.MALFORMED, `Missing required parameters: ${missing.join(', ')}`);
            return false;
        }

        return true;
    }

    private validateUser(): boolean {
        const required = ['id', 'room', 'host', 'connected'];
        const properties = Object.keys(this.socket);
        const missing = required.filter(property => !properties.includes(property));
        
        if (missing.length) {
            // socket improperly initialized
            sendError(this.socket, ERROR_CODE.MALFORMED);
            return false;
        }

        const room = this.socket.room;
        if (!this.validateRoomExists(room)) {
            return false;
        }

        const id = this.socket.id;
        if (!this.rooms.userInRoom(room, id)) {
            sendError(this.socket, ERROR_CODE.USERNOTFOUND);
            return false;
        }

        return true;
    }

    private validateCreate(args: CreateEventData): boolean {
        return true;
    }

    private validateJoin(args: JoinEventData): boolean {
        if (!this.validateParameters(args, ['code'])) {
            return false;
        }

        return this.validateRoomExists(args.code);
    }

    private validateReconnect(args: ReconnectEventData): boolean {
        if (!this.validateParameters(args, ['code', 'id'])) {
            return false;
        }

        return this.validateRoomExists(args.code);
    }

    private validateClose(args: CloseEventData): boolean {
        return this.validateUser();
    }

    private validateLeave(args: LeaveEventData): boolean {
        return this.validateUser();
    }

    private validateAdministrate(args: AdministrateEventData): boolean {
        return this.validateUser();
    }

    private validateMessage(args: ClientMessageEventData): boolean {
        if (!this.validateParameters(args, ['event', 'args'])) {
            return false;
        }

        if (!this.validateUser()) {
            return false;
        }

        if (this.userIsHost() && !args.recipients) {
            sendError(this.socket, ERROR_CODE.MALFORMED, 'Message from host must contain recipients');
            return false;
        } else if (!this.userIsHost() && args.recipients) {
            sendError(this.socket, ERROR_CODE.MALFORMED, 'Message from client must not contain recipients');
            return false;
        }

        return true;
    }

    private validatePing(args: PingEventData): boolean {
        if (!this.validateParameters(args, ['time'])) {
            return false;
        }

        return this.validateUser();
    }

    private validateKick(args: KickEventData): boolean {
        if (!this.validateUser()) {
            return false;
        }

        if (!this.userIsHost()) {
            sendError(this.socket, ERROR_CODE.INSUFFICIENTPERMISSIONS, 'Only the host can kick');
            return false;
        }

        return true;
    }
}
