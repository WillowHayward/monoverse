import type { WebSocket } from 'ws';

export interface LipwigSocket extends WebSocket {
  id: string;
  room: string;
  host: boolean;
}
