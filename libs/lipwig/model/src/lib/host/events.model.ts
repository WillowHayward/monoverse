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

export interface PingServer extends EventStructure {
    event: HOST_EVENT.PING_SERVER;
    data: PingServerData;
}

export interface PingServerData {
    time: number;
}

export interface PingClient extends EventStructure {
    event: HOST_EVENT.PING_CLIENT;
    data: PingClientData;
}

export interface PingClientData {
    time: number;
    id: string; 
}

export interface PongHost extends EventStructure {
    event: HOST_EVENT.PONG_HOST;
    data: PongHostData;
}

export interface PongHostData {
    time: number;
    id: string;
}


export type Event = Create | Message | Kick | LocalJoin | LocalLeave | PingServer | PingClient | PongHost;
export type EventData = CreateData | MessageData | KickData | /* LocalJoinData | LocalLeaveData | */ PingServerData | PingClientData | PongHostData;

