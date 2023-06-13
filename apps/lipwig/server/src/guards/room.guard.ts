import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RoomService } from '../room/room.service';
import { WebSocket } from '../app/app.model';
import { CLIENT_EVENT, ERROR_CODE, HOST_EVENT } from '@whc/lipwig/model';
import { LipwigSocket } from '../classes/LipwigSocket';

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
        const rawSocket: WebSocket = context.switchToWs().getClient();
        this.socket = rawSocket.socket;
        const event = this.reflector.get<string>(
            'message',
            context.getHandler()
        );
        const args: any = context.getArgs()[1];

        return this.validate(event, args);
    }

    private validate(event: string, args: any): boolean {
        if (!this.isValidEvent(event)) {
            this.socket.error(
                ERROR_CODE.MALFORMED,
                `Invalid event '${event}'`
            );
            return false;
        }

        const validator = this.getValidator(event);

        if (
            validator.required &&
            !this.validateParameters(args, validator.required)
        ) {
            return false;
        }

        if (validator.roomExists && !this.validateRoomExists(args.code)) {
            return false;
        }

        if (validator.validUser && !this.validateUser()) {
            return false;
        }

        if (validator.isHost !== undefined) {
            const isHost = this.socket.isHost;
            if (!isHost && validator.isHost) {
                this.socket.error(ERROR_CODE.INSUFFICIENTPERMISSIONS);
                return false;
            } else if (isHost && !validator.isHost) {
                // TODO: Is this also just insufficient permissions?
                this.socket.error(
                    ERROR_CODE.MALFORMED,
                    `Cannot use event '${event}' as host`
                );
                return false;
            }
        }

        if (validator.other && !validator.other(args)) {
            return false;
        }

        return true;
    }

    private isValidEvent(event: string): event is CLIENT_EVENT {
        const clientEvents = Object.values(CLIENT_EVENT);
        if (clientEvents.includes(event as CLIENT_EVENT)) {
            return true;
        }

        const hostEvents = Object.values(HOST_EVENT);
        if (hostEvents.includes(event as HOST_EVENT)) {
            return true;
        }

        this.socket.error(ERROR_CODE.MALFORMED, `No such event '${event}'`);
        return false;
    }

    private validateRoomExists(room: string): boolean {
        if (!room || !this.rooms.roomExists(room)) {
            this.socket.error(ERROR_CODE.ROOMNOTFOUND);
            return false;
        }

        return true;
    }

    private validateParameters(args: any, required: string[]): boolean {
        const params = Object.keys(args);
        const missing = required.filter((param) => !params.includes(param));

        if (missing.length) {
            this.socket.error(
                ERROR_CODE.MALFORMED,
                `Missing required parameters: ${missing.join(', ')}`
            );
            return false;
        }

        return true;
    }

    private validateUser(): boolean {
        if (!this.socket.initialized) {
            // socket improperly initialized
            this.socket.error(ERROR_CODE.MALFORMED);
            return false;
        }

        const room = this.socket.room;
        if (room.closed) {
            this.socket.error(ERROR_CODE.ROOMCLOSED);
            return false;
        }

        return true;
    }

    private getValidator(event: CLIENT_EVENT | HOST_EVENT): Validator {
        switch (event) {
            case HOST_EVENT.CREATE:
                return {};
            case CLIENT_EVENT.JOIN:
                return {
                    required: ['code'],
                    roomExists: true,
                };
            case CLIENT_EVENT.RECONNECT:
                return {
                    required: ['code', 'id'],
                    roomExists: true,
                };
            //case CLIENT_EVENT.ADMINISTRATE:
                //return {}; // TODO: Determine administrate flow
            case CLIENT_EVENT.MESSAGE:
                return {
                    required: ['event', 'args'],
                    validUser: true,
                    other: (args: any) => {
                        if (this.socket.isHost && !args.recipients) {
                            this.socket.error(
                                ERROR_CODE.MALFORMED,
                                'Message from host must contain recipients'
                            );
                            return false;
                        } else if (!this.socket.isHost && args.recipients) {
                            this.socket.error(
                                ERROR_CODE.MALFORMED,
                                'Message from client must not contain recipients'
                            );
                            return false;
                        }

                        return true;
                    },
                };
            /*case CLIENT_EVENT.PING:
                return {
                    required: ['time'],
                    validUser: true,
                };*/
            case HOST_EVENT.PING_CLIENT:
            case HOST_EVENT.PONG_HOST:
                return {
                    required: ['time', 'id'],
                    isHost: true
                };
            case CLIENT_EVENT.PING_HOST:
            case CLIENT_EVENT.PONG_CLIENT:
            case CLIENT_EVENT.PING_SERVER:
            case HOST_EVENT.PING_SERVER: 
                return {
                    required: ['time']
                }
            case HOST_EVENT.KICK:
                return {
                    required: ['id'],
                    isHost: true,
                };
            default:
                console.warn(`Guard not set up for event '${event}'`);
                return {};
        }
    }
}
