/**
 * @author: WillHayCode
 */

import { ServerEvent, ClientEvent, ErrorCode } from './enums';
import { RoomConfig, UserOptions } from './common.model';

export interface MessageData {
    event?: string;
    args: unknown[];
    recipient: string[];
    sender: string;
}

export interface Message {
    event: string;
    data: unknown;
}

// Client Events
export interface CreateEvent extends Message {
    event: ClientEvent.CREATE;
    data: CreateEventData;
}

export interface CreateEventData {
    config: RoomConfig;
}

export interface JoinEvent extends Message {
    event: ClientEvent.JOIN;
    data: JoinEventData;
}

export interface JoinEventData {
    code: string;
    user: UserOptions;
}

export interface ReconnectEvent extends Message {
    event: ClientEvent.RECONNECT;
    data: ReconnectEventData;
}

export interface ReconnectEventData {

}

export interface CloseEvent extends Message {
    event: ClientEvent.CLOSE;
    data: CloseEventData;
}

export interface CloseEventData {
    reason?: string;
}

export interface AdministrateEvent extends Message {
    event: ClientEvent.ADMINISTRATE;
    data: AdministrateEventData;
}

export interface AdministrateEventData {

}

export interface ClientMessageEvent extends Message { // TODO: This may have to be divided into lipwig host and lipwig client events
    event: ClientEvent.MESSAGE;
    data: ClientMessageEventData;
}

export interface ClientMessageEventData {
    sender: string;
    recipient: string[];
    args: unknown[];
}

export interface PingEvent extends Message {
    event: ClientEvent.PING;
    data: PingEventData;
}

export interface PingEventData {
    time: number;
}

// Server Events

export interface CreatedEvent extends Message {
    event: ServerEvent.CREATED;
    data: CreatedEventData;
}

export interface CreatedEventData {
    id: string;
}


export interface JoinedEvent extends Message {
    event: ServerEvent.JOINED;
    data: JoinedEventData;
}

export interface JoinedEventData {
    id: string;
}

export interface ReconnectedEvent extends Message {
    event: ServerEvent.RECONNECTED;
    data: ReconnectedEventData;
}

export interface ReconnectedEventData {

}

export interface ErrorEvent extends Message {
    event: ServerEvent.ERROR;
    data: ErrorEventData;
}

export interface ErrorEventData {
    code: ErrorCode;
}

export interface ServerMessageEvent extends Message {
    event: ServerEvent.MESSAGE;
    data: ServerEventData;
}

export interface ServerEventData {
    recipient: string[];
    args: unknown[];
}

/*export interface ClientMessage extends Message {
    event: ClientEvent;
};

export interface ServerMessage extends Message {
    event: ServerEvent;
}
*/
