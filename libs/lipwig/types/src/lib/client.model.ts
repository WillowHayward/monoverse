/**
 * @author: WillHayCode
 */
import { Message } from './common.model';

type ClientMessageEvent = 'create' | 'join' | 'reconnect' | 'close' | 'administrate' | 'message'
                        | 'lw-ping';

export interface ClientMessage extends Message {
    event: ClientMessageEvent;
};

export type DataMap = {
  [key:string]: unknown
};

export const DEFAULTS = {
  port: 8989
};
