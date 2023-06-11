/**
 * @author: WillHayCode
 */
import { RoomConfig, UserOptions } from "./common.model";
import { CLIENT_EVENT } from "./enums";

export const DEFAULTS = {
    port: 8989,
};

// Message events
interface ClientEventStructure {
    event: CLIENT_EVENT;
    data: unknown;
}

export interface ClientMessageEvent extends ClientEventStructure {
    event: CLIENT_EVENT.MESSAGE;
    data: ClientMessageEventData;
}

export interface ClientMessageEventData {
    event: string;
    recipients?: string[]; // Added by host for host -> client messages
    args: unknown[];
}

export interface CreateEvent extends ClientEventStructure {
    event: CLIENT_EVENT.CREATE;
    data: CreateEventData;
}

export interface CreateEventData {
    config?: RoomConfig;
}

export interface JoinEvent extends ClientEventStructure {
    event: CLIENT_EVENT.JOIN;
    data: JoinEventData;
}

export interface JoinEventData {
    code: string;
    options?: UserOptions;
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

export interface LeaveEvent extends ClientEventStructure {
    event: CLIENT_EVENT.LEAVE;
    data: LeaveEventData;
}

export interface LeaveEventData {

}

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
    id: string;
    reason?: string;
}

export interface LocalJoinEvent extends ClientEventStructure {
    event: CLIENT_EVENT.LOCAL_JOIN;
    data: LocalJoinEventData;
}

export interface LocalJoinEventData {
}

export interface LocalLeaveEvent extends ClientEventStructure {
    event: CLIENT_EVENT.LOCAL_LEAVE;
    data: LocalLeaveEventData;
}

export interface LocalLeaveEventData {
}

export type ClientEvent = ClientMessageEvent | CreateEvent | JoinEvent | ReconnectEvent | CloseEvent | AdministrateEvent | PingEvent | KickEvent;

