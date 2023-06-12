import { ERROR_CODE, ServerClientEvents, ServerHostEvents } from '@whc/lipwig/model';
import * as WebSocket from 'ws';

export interface LipwigSocket extends WebSocket {
    id: string;
    room: string;
    isHost: boolean;
    connected: boolean;

    sendError: (error: ERROR_CODE, message?: string) => void;
    sendMessage: (message: ServerHostEvents.Event | ServerClientEvents.Event) => void;
}
