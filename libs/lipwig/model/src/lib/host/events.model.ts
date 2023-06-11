import { RoomConfig } from "../common.model";
import { HOST_EVENT } from "./host.model";

interface EventStructure {
    event: HOST_EVENT,
}

export interface Create extends EventStructure {
    event: HOST_EVENT.CREATE;
    data: CreateData;
}

export interface CreateData {
    config?: RoomConfig;
}

export interface Message extends EventStructure {
    event: HOST_EVENT.MESSAGE;
    data: MessageData;
}

export interface MessageData {
    event: string;
    recipients: string[]; 
    args: unknown[];
}

export interface Ping extends EventStructure {
    event: HOST_EVENT.PING;
    data: PingData;
}

export interface PingData {
    time: number;
}

export interface Pong extends EventStructure {
    event: HOST_EVENT.PONG;
    data: PongData;
}

export interface PongData {
    time: number;
}

export interface Kick extends EventStructure {
    event: HOST_EVENT.KICK;
    data: KickData;
}

export interface KickData {
    id: string;
    reason?: string;
}

export interface Reconnect extends EventStructure {
    event: HOST_EVENT.RECONNECT;
    data: ReconnectData;
}

export interface ReconnectData {
    code: string;
    id: string;
}

export interface LocalJoin extends EventStructure {
    event: HOST_EVENT.LOCAL_JOIN;
}

export interface LocalLeave extends EventStructure {
    event: HOST_EVENT.LOCAL_LEAVE;
}

export type Event = Create | Message | Kick | LocalJoin | LocalLeave | Ping | Pong;

