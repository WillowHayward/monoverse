/**
 * @author: WillHayCode
 */

import { SERVER_EVENT, CLIENT_EVENT, ERROR_CODE } from './enums';
import { RoomConfig, UserOptions } from './common.model';

const serverEvents = Object.values(SERVER_EVENT);
const clientEvents = Object.values(CLIENT_EVENT);

export const EVENTS_SERVER = new Set(serverEvents);
export const CLIENT_EVENT_SERVER = new Set(clientEvents);
export const EVENTS_ALL = new Set([...serverEvents, ...clientEvents]);

interface GenericEvent {
    event: CLIENT_EVENT | SERVER_EVENT;
    data: unknown;
}

interface ClientEventStructure extends GenericEvent {
    event: CLIENT_EVENT;
}

interface ServerEventStructure extends GenericEvent {
    event: SERVER_EVENT;
}


// Client GenericEvents
export interface ClientMessageEvent extends GenericEvent {
    event: CLIENT_EVENT.MESSAGE;
    data: ClientMessageEventData;
}

export interface ClientMessageEventData {
    event: string;
    recipient?: string[]; // Added by host for host -> client messages
    args: unknown[];
}

export interface CreateEvent extends ClientEventStructure {
    event: CLIENT_EVENT.CREATE;
    data: CreateEventData;
}

export interface CreateEventData {
    config: RoomConfig;
}

export interface JoinEvent extends ClientEventStructure {
    event: CLIENT_EVENT.JOIN;
    data: JoinEventData;
}

export interface JoinEventData {
    code: string;
    options: UserOptions;
}

export interface ReconnectEvent extends ClientEventStructure {
    event: CLIENT_EVENT.RECONNECT;
    data: ReconnectEventData;
}

export interface ReconnectEventData {
    code: string;
    id: string;
}

export interface CloseEvent extends ClientEventStructure {
    event: CLIENT_EVENT.CLOSE;
    data: CloseEventData;
}

export interface CloseEventData {
    reason?: string;
}

export interface AdministrateEvent extends ClientEventStructure {
    event: CLIENT_EVENT.ADMINISTRATE;
    data: AdministrateEventData;
}

export interface AdministrateEventData {}

export interface PingEvent extends ClientEventStructure {
    event: CLIENT_EVENT.PING;
    data: PingEventData;
}

export interface PingEventData {
    time: number;
}

export interface KickEvent extends ClientEventStructure {
    event: CLIENT_EVENT.KICK;
    data: KickEventData;
}

export interface KickEventData {
    reason?: string;
}

export type ClientEvent = ClientMessageEvent | CreateEvent | JoinEvent | ReconnectEvent | CloseEvent | AdministrateEvent | PingEvent | KickEvent;

// Server GenericEvents
export interface ServerMessageEvent extends GenericEvent {
    event: SERVER_EVENT.MESSAGE;
    data: ServerMessageEventData;
}

export interface ServerMessageEventData {
    event: string;
    sender?: string; // Added by server for client -> host messages
    args: unknown[];
}

export interface CreatedEvent extends ServerEventStructure {
    event: SERVER_EVENT.CREATED;
    data: CreatedEventData;
}

export interface CreatedEventData {
    code: string;
    id: string;
}

export interface JoinedEvent extends ServerEventStructure {
    event: SERVER_EVENT.JOINED;
    data: JoinedEventData;
}

export interface JoinedEventData {
    id: string;
    options?: UserOptions;
}

export interface ReconnectedEvent extends ServerEventStructure {
    event: SERVER_EVENT.RECONNECTED;
    data: ReconnectedEventData;
}

export interface ReconnectedEventData {}

export interface ErrorEvent extends ServerEventStructure {
    event: SERVER_EVENT.ERROR;
    data: ErrorEventData;
}

export interface ErrorEventData {
    code: ERROR_CODE;
}

export interface KickedEvent extends ServerEventStructure {
    event: SERVER_EVENT.KICKED;
    data: KickedEventData;
}

export interface KickedEventData {
    reason?: string;
}

export type ServerEvent = ServerMessageEvent | CreatedEvent | JoinedEvent | ReconnectedEvent | ErrorEvent | KickedEvent;
