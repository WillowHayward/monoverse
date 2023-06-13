import { ERROR_CODE, SERVER_CLIENT_EVENT, ServerClientEvents, ServerHostEvents, CLOSE_CODE } from '@whc/lipwig/model';
import { WebSocket } from '../app/app.model';
import { Room } from './Room';

type Callback = (...args: any[]) => void;

export class LipwigSocket {
    private events: {
        [event: string]: Callback[]
    } = {};
    id: string;
    isHost: boolean;
    room: Room;

    connected = false;
    initialized = false;
    constructor(private socket: WebSocket) {
    }

    public initialize(id: string, isHost: boolean, room: Room) {
        this.isHost = isHost;
        this.room = room;
        this.id = id;
        this.connected = true;
        this.initialized = true;

        if (isHost) {
            this.setHostListeners();
        } else {
            this.setClientListeners();
        }
    }

    private setHostListeners() {
        this.socket.on('close', (code: CLOSE_CODE, reasonBuffer: Buffer) => {
            let emit: string;
            let reason: string;
            switch (code) {
                case CLOSE_CODE.CLOSED:
                    emit = 'close';
                    if (reasonBuffer.length) {
                        reason = reasonBuffer.toString('utf8');
                    }
                break;
                case CLOSE_CODE.LEFT:
                case CLOSE_CODE.KICKED:
                    break;
                default:
                    emit = 'disconnect';
                    break;
            }

            if (emit) {
                this.emit(emit, reason);
            }
        });
    }

    private setClientListeners() {
        this.socket.on('close', (code: CLOSE_CODE, reasonBuffer: Buffer) => {
            let emit: string;
            let reason: string;
            switch (code) {
                case CLOSE_CODE.LEFT:
                    emit = 'leave';
                    if (reasonBuffer.length) {
                        reason = reasonBuffer.toString('utf8');
                    }
                break;
                case CLOSE_CODE.CLOSED:
                case CLOSE_CODE.KICKED:
                    break;
                default:
                    emit = 'disconnect';
                    break;
            }

            if (emit) {
                this.emit(emit, reason);
            }
        });

    }

    send(message: ServerHostEvents.Event | ServerClientEvents.Event) {
        const messageString = JSON.stringify(message);
        this.socket.send(messageString);
    }

    error(error: ERROR_CODE, message?: string) {
        console.error('Error with', this.id, error, message);
        // TODO: Try to make this more generic than ServerClient (it's just for type checking but it'd be nice)
        const errorMessage: ServerClientEvents.Error = {
            event: SERVER_CLIENT_EVENT.ERROR,
            data: {
                error,
                message,
            },
        };
        this.send(errorMessage);
    }

    close(code: CLOSE_CODE, reason?: string) {
        this.socket.close(code, reason);
    }

    on(event: 'leave', callback: (reason?: string) => void): void
    on(event: 'close', callback: (reason?: string) => void): void
    on(event: 'disconnect', callback: (reason?: string) => void): void
    on(event: string, callback: (...args: any[]) => void): void {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    emit(event: string, ...args: any[]) {
        const callbacks = this.events[event] || [];
        for (const callback of callbacks) {
            callback(...args);
        }
    }
}
