/**
 * @author: WillHayCode
 */
import { UserOptions } from "./common.model";
import { ERROR_CODE, SERVER_EVENT } from "./enums";

export type LipwigOptions = {
    port: number;
    roomNumberLimit: number;
    roomSizeLimit: number;
    name: string;
    db: string;
};

export type LipwigConfig = Partial<LipwigOptions>;

// Message events
interface ServerEventStructure {
    event: SERVER_EVENT;
    data: unknown;
}

export interface ServerMessageEvent extends ServerEventStructure {
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

export interface ReconnectedEventData {
    room: string;
    id: string;
}

export interface HostReconnectedEvent extends ServerEventStructure {
    event: SERVER_EVENT.HOST_RECONNECTED;
    data: HostReconnectedEventData;
}

export interface HostReconnectedEventData {
    room: string;
    id: string;
    users?: string[]; // Array of user ids sent to host
    local?: number; // Number of local users to send to host
}

export interface ErrorEvent extends ServerEventStructure {
    event: SERVER_EVENT.ERROR;
    data: ErrorEventData;
}

export interface ErrorEventData {
    error: ERROR_CODE;
    message?: string;
}

export interface KickedEvent extends ServerEventStructure {
    event: SERVER_EVENT.KICKED;
    data: KickedEventData;
}

export interface KickedEventData {
    reason?: string;
}

export interface DisconnectedEvent {
    event: SERVER_EVENT.DISCONNECTED
    data: DisconnectedEventData;
}

export interface DisconnectedEventData {
    id: string;
}

export interface HostDisconnectedEvent {
    event: SERVER_EVENT.HOST_DISCONNECTED
    data: HostDisconnectedEventData;
}

export interface HostDisconnectedEventData {
}

export type ServerEvent = ServerMessageEvent | CreatedEvent | JoinedEvent | ReconnectedEvent | HostReconnectedEvent | ErrorEvent | KickedEvent | DisconnectedEvent | HostDisconnectedEvent;

