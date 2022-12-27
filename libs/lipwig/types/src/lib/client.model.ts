/**
 * @author: WillHayCode
 */

import { Message } from './common.model';

//type ClientMessageEvent = 'create' | 'join' | 'reconnect' | 'close' | 'administrate' | 'message'
//                        | 'lw-ping';

enum ClientEvent {
    CREATE = 'create',
    JOIN = 'join',
    RECONNECT = 'reconnect',
    CLOSE = 'close',
    ADMINISTRATE = 'administrate',
    MESSAGE = 'message',
    PING = 'lw-ping'
}

export interface ClientMessage extends Message {
    event: ClientEvent;
};

export type DataMap = {
  [key:string]: unknown
};

export const DEFAULTS = {
  port: 8989
};
