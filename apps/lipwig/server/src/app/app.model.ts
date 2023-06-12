import * as RawWebSocket from 'ws';
import { LipwigSocket } from '../socket/LipwigSocket';

export interface WebSocket extends RawWebSocket {
    socket: LipwigSocket
}
