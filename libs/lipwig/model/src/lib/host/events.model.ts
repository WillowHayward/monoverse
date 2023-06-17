import { CreateOptions } from "../common.model";
import { HOST_EVENT } from "./host.model";

interface EventStructure {
    event: HOST_EVENT,
}

export interface Create extends EventStructure {
    event: HOST_EVENT.CREATE;
    data: CreateData;
}

export interface CreateData {
    config?: CreateOptions;
}

export interface JoinResponse extends EventStructure {
    event: HOST_EVENT.JOIN_RESPONSE;
    data: JoinResponseData;
}

export interface JoinResponseData {
    id: string;
    response: boolean;
    reason?: string;
}

export interface Lock extends EventStructure {
    event: HOST_EVENT.LOCK;
    data: LockData;
}

export interface LockData {
    reason?: string;
}

export interface Unlock extends EventStructure {
    event: HOST_EVENT.UNLOCK;
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

export interface Poll extends EventStructure {
    event: HOST_EVENT.POLL,
    data: PollData
}

export interface PollData {
    id: string;
    recipients: string[];
    query: string;
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
    data: LocalJoinData;
}

export interface LocalJoinData {
    id: string;
}

export interface LocalLeave extends EventStructure {
    event: HOST_EVENT.LOCAL_LEAVE;
    data: LocalJoinData;
}

export interface LocalLeaveData {
    id: string;
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


export type Event = Create | JoinResponse | Lock | Unlock| Message | Kick | Poll | LocalJoin | LocalLeave | PingServer | PingClient | PongHost;
export type EventData = CreateData | JoinResponseData | LockData | MessageData | KickData | PollData | LocalJoinData | LocalLeaveData | PingServerData | PingClientData | PongHostData;

