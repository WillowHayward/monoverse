import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RoomService } from './room.service';
import { LipwigSocket } from '../app/app.model';
import { sendError } from './utils';
import { CLIENT_EVENT, ERROR_CODE } from '@whc/lipwig/types';

interface Validator {
    required?: string[]; // Required paramaters on request
    roomExists?: boolean; // Code parameter passed is real room
    validUser?: boolean; // User is valid (initialised, exists in room)
    isHost?: boolean; // If the user is or isn't the host. Leave undefined for either.
    other?: (args: any) => boolean; // Event-specific validation function
}

@Injectable()
export class RoomGuard implements CanActivate {
    private socket: LipwigSocket;

    constructor(private reflector: Reflector, private rooms: RoomService) {}

    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        this.socket = context.switchToWs().getClient();
        const event = this.reflector.get<string>('message', context.getHandler());
        const args: any = context.getArgs()[1];

        if (!this.validate(event, args)) {
            return false;
        }

        return true;
    }

    private validate(event: string, args: any): boolean {
        if (!this.isValidEvent(event)) {
            sendError(this.socket, ERROR_CODE.MALFORMED, `Invalid event '${event}'`);
            return false;
        }

        const validator = this.getValidator(event);

        if (validator.required && !this.validateParameters(args, validator.required)) {
            return false;
        }

        if (validator.roomExists && !this.validateRoomExists(args.code)) {
            return false;
        }

        if (validator.validUser && !this.validateUser()) {
            return false;
        }

        if (validator.isHost !== undefined) {
            const isHost = this.userIsHost();
            if (!isHost && validator.isHost) {
                sendError(this.socket, ERROR_CODE.INSUFFICIENTPERMISSIONS);
                return false;
            } else if (isHost && !validator.isHost) {
                // TODO: Is this also just insufficient permissions?
                sendError(this.socket, ERROR_CODE.MALFORMED, `Cannot use event '${event}' as host`);
                return false;
            }
        }

        if (validator.other && !validator.other(args)) {
            return false;
        }

        return true;
    }

    private isValidEvent(event: string): event is CLIENT_EVENT {
        const events = Object.values(CLIENT_EVENT);
        return events.includes(event as CLIENT_EVENT);
    }

    private userIsHost(): boolean {
        return this.rooms.userIsHost(this.socket.room, this.socket.id);
    }

    private validateRoomExists(room: string): boolean {
        if (!room || !this.rooms.roomExists(room)) {
            sendError(this.socket, ERROR_CODE.ROOMNOTFOUND);
            return false;
        }

        return true;
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

    private getValidator(event: CLIENT_EVENT): Validator {
        switch (event) {
            case CLIENT_EVENT.CREATE:
                return {};
            case CLIENT_EVENT.JOIN:
                return {
                    required: ['code'],
                    roomExists: true
                }
            case CLIENT_EVENT.RECONNECT:
                return {
                    required: ['code', 'id'],
                    roomExists: true
                }
            case CLIENT_EVENT.CLOSE:
                return {
                    validUser: true,
                    isHost: true
                }
            case CLIENT_EVENT.LEAVE:
                return {
                    validUser: true,
                    isHost: false
                }
            case CLIENT_EVENT.ADMINISTRATE:
                return {}; // TODO: Determine administrate flow
            case CLIENT_EVENT.MESSAGE:
                return {
                    required: ['event', 'args'],
                    validUser: true,
                    other: (args: any) => {
                        if (this.userIsHost() && !args.recipients) {
                            sendError(this.socket, ERROR_CODE.MALFORMED, 'Message from host must contain recipients');
                            return false;
                        } else if (!this.userIsHost() && args.recipients) {
                            sendError(this.socket, ERROR_CODE.MALFORMED, 'Message from client must not contain recipients');
                            return false;
                        }

                        return true;
                    }
                }
            case CLIENT_EVENT.PING:
                return {
                    required: ['time'],
                    validUser: true
                }
            case CLIENT_EVENT.KICK:
                return {
                    isHost: true
                }
            default:
                console.warn(`Guard not set up for event '${event}'`);
                return {};
        }
    }
}
