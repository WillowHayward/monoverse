import * as RawWebSocket from 'ws';
import { LipwigSocket } from '../classes/LipwigSocket';

export interface WebSocket extends RawWebSocket {
    socket: LipwigSocket
}
