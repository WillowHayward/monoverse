/**
 * @author: WillHayCode
 */
import { Message } from './common.model';
type ServerMessageEvent = 'created' | 'joined' | 'reconnected' | 'message'

export interface ServerMessage extends Message {
    event: ServerMessageEvent;
}
