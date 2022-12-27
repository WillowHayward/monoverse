/**
 * @author: WillHayCode
 */

import { Message } from './common.model';
//type ServerMessageEvent = 'created' | 'joined' | 'reconnected' | 'message'

enum ServerEvent {
    CREATED = 'created',
    JOINED = 'joined',
    RECONNECTED = 'reconnected',
    MESSAGE = 'message'
}

export interface ServerMessage extends Message {
    event: ServerEvent;
}

export type LipwigOptions = {
    port: number;
    roomNumberLimit: number;
    roomSizeLimit: number;
    name: string;
    db: string;
};

export type LipwigConfig = Partial<LipwigOptions>;

