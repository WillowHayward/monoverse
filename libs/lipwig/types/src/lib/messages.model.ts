/**
 * @author: WillHayCode
 */

import { SERVER_EVENT, CLIENT_EVENT, ERROR_CODE } from './enums';
import { RoomConfig, UserOptions } from './common.model';

export interface GenericEvent {
    event: string;
    data: unknown;
}

export interface ClientEvent extends GenericEvent {
    event: CLIENT_EVENT;
}

export interface ServerEvent extends GenericEvent {
    event: SERVER_EVENT;
}

// Common GenericEvents

export interface LipwigMessageEvent extends GenericEvent { 
    event: CLIENT_EVENT.MESSAGE | SERVER_EVENT.MESSAGE;
    data: LipwigMessageEventData;
}

export interface LipwigMessageEventData {
    event: string;
    sender: string;
    recipient: string[];
    args: unknown[];
}


// Client GenericEvents
export interface CreateEvent extends ClientEvent {
    event: CLIENT_EVENT.CREATE;
    data: CreateEventData;
}

export interface CreateEventData {
    config: RoomConfig;
}

export interface JoinEvent extends ClientEvent {
    event: CLIENT_EVENT.JOIN;
    data: JoinEventData;
}

export interface JoinEventData {
    code: string;
    options: UserOptions;
}

export interface ReconnectEvent extends ClientEvent {
    event: CLIENT_EVENT.RECONNECT;
    data: ReconnectEventData;
}

export interface ReconnectEventData {

}

export interface CloseEvent extends ClientEvent {
    event: CLIENT_EVENT.CLOSE;
    data: CloseEventData;
}

export interface CloseEventData {
    reason?: string;
}

export interface AdministrateEvent extends ClientEvent {
    event: CLIENT_EVENT.ADMINISTRATE;
    data: AdministrateEventData;
}

export interface AdministrateEventData {

}

export interface PingEvent extends ClientEvent {
    event: CLIENT_EVENT.PING;
    data: PingEventData;
}

export interface PingEventData {
    time: number;
}

// Server GenericEvents

export interface CreatedEvent extends ServerEvent {
    event: SERVER_EVENT.CREATED;
    data: CreatedEventData;
}

export interface CreatedEventData {
    id: string;
}


export interface JoinedEvent extends ServerEvent {
    event: SERVER_EVENT.JOINED;
    data: JoinedEventData;
}

export interface JoinedEventData {
    id: string;
}

export interface ReconnectedEvent extends ServerEvent {
    event: SERVER_EVENT.RECONNECTED;
    data: ReconnectedEventData;
}

export interface ReconnectedEventData {

}

export interface ErrorEvent extends ServerEvent {
    event: SERVER_EVENT.ERROR;
    data: ErrorEventData;
}

export interface ErrorEventData {
    code: ERROR_CODE;
}
