/**
 * @author: WillHayCode
 */

import { ServerEvent, ClientEvent, ErrorCode } from './enums';
import { RoomConfig, UserOptions } from './common.model';

interface Message {
    event: string;
    data: unknown;
}

interface ClientMessage extends Message {
    event: ClientEvent;
}

interface ServerMessage extends Message {
    event: ServerEvent;
}

// Client Events
export interface CreateEvent extends ClientMessage {
    event: ClientEvent.CREATE;
    data: CreateEventData;
}

export interface CreateEventData {
    config: RoomConfig;
}

export interface JoinEvent extends ClientMessage {
    event: ClientEvent.JOIN;
    data: JoinEventData;
}

export interface JoinEventData {
    code: string;
    user: UserOptions;
}

export interface ReconnectEvent extends ClientMessage {
    event: ClientEvent.RECONNECT;
    data: ReconnectEventData;
}

export interface ReconnectEventData {

}

export interface CloseEvent extends ClientMessage {
    event: ClientEvent.CLOSE;
    data: CloseEventData;
}

export interface CloseEventData {
    reason?: string;
}

export interface AdministrateEvent extends ClientMessage {
    event: ClientEvent.ADMINISTRATE;
    data: AdministrateEventData;
}

export interface AdministrateEventData {

}

export interface ClientMessageEvent extends ClientMessage { // TODO: This may have to be divided into lipwig host and lipwig client events
    event: ClientEvent.MESSAGE;
    data: ClientMessageEventData;
}

export interface ClientMessageEventData {
    sender: string;
    recipient: string[];
    args: unknown[];
}

export interface PingEvent extends ClientMessage {
    event: ClientEvent.PING;
    data: PingEventData;
}

export interface PingEventData {
    time: number;
}

// Server Events

export interface CreatedEvent extends ServerMessage {
    event: ServerEvent.CREATED;
    data: CreatedEventData;
}

export interface CreatedEventData {
    id: string;
}


export interface JoinedEvent extends ServerMessage {
    event: ServerEvent.JOINED;
    data: JoinedEventData;
}

export interface JoinedEventData {
    id: string;
}

export interface ReconnectedEvent extends ServerMessage {
    event: ServerEvent.RECONNECTED;
    data: ReconnectedEventData;
}

export interface ReconnectedEventData {

}

export interface ErrorEvent extends ServerMessage {
    event: ServerEvent.ERROR;
    data: ErrorEventData;
}

export interface ErrorEventData {
    code: ErrorCode;
}

export interface ServerMessageEvent extends ServerMessage {
    event: ServerEvent.MESSAGE;
    data: ServerEventData;
}

export interface ServerEventData {
    recipient: string[];
    args: unknown[];
}
