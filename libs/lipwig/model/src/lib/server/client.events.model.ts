import { UserOptions, ERROR_CODE } from "../common.model";
import { SERVER_CLIENT_EVENT } from "./server.model";

// Server -> Client messages
interface EventStructure {
    event: SERVER_CLIENT_EVENT,
}

export interface Joined extends EventStructure {
    event: SERVER_CLIENT_EVENT.JOINED;
    data: JoinedData;
}

export interface JoinedData {
    id: string;
    options?: UserOptions;
}

export interface Disconnected extends EventStructure {
    event: SERVER_CLIENT_EVENT.DISCONNECTED;
    data: DisconnectedData;
}

export interface DisconnectedData {
    id: string;
}

export interface HostDisconnected extends EventStructure {
    event: SERVER_CLIENT_EVENT.HOST_DISCONNECTED;
}

export interface Reconnected extends EventStructure {
    event: SERVER_CLIENT_EVENT.RECONNECTED;
    data: ReconnectedData;
}

export interface ReconnectedData {
    room: string;
    id: string;
}

export interface HostReconnected extends EventStructure {
    event: SERVER_CLIENT_EVENT.HOST_RECONNECTED;
    data: HostReconnectedData;
}

export interface HostReconnectedData {
    room: string;
    id: string;
}

export interface Error extends EventStructure {
    event: SERVER_CLIENT_EVENT.ERROR;
    data: ErrorData;
}

export interface ErrorData {
    error: ERROR_CODE;
    message?: string;
}

export interface Message extends EventStructure {
    event: SERVER_CLIENT_EVENT.MESSAGE;
    data: MessageData;
}

export interface MessageData {
    event: string;
    args: unknown[];
}

export interface Ping {
    event: SERVER_CLIENT_EVENT.PING;
    data: PingData;
}

export interface PingData {
    time: number;
}

export interface Pong {
    event: SERVER_CLIENT_EVENT.PONG;
    data: PongData;
}

export interface PongData {
    time: number;
}

export type Event = Joined | Disconnected | HostDisconnected | Reconnected | HostReconnected | Error | Message | Ping | Pong;
