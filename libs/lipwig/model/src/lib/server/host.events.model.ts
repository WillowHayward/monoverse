import { UserOptions, ERROR_CODE } from "../common.model";
import { SERVER_HOST_EVENT } from "./server.model";

// Server -> Host messages
interface EventStructure {
    event: SERVER_HOST_EVENT,
}

export interface Created extends EventStructure {
    event: SERVER_HOST_EVENT.CREATED;
    data: CreatedData;
}

export interface CreatedData {
    code: string;
    id: string;
}

export interface Joined extends EventStructure {
    event: SERVER_HOST_EVENT.JOINED;
    data: JoinedData;
}

export interface JoinedData {
    id: string;
    options?: UserOptions;
}

export interface Disconnected extends EventStructure {
    event: SERVER_HOST_EVENT.DISCONNECTED;
}

export interface ClientDisconnected extends EventStructure {
    event: SERVER_HOST_EVENT.CLIENT_DISCONNECTED;
    data: ClientDisconnectedData;
}

export interface ClientDisconnectedData {
    id: string;
}

export interface Reconnected extends EventStructure {
    event: SERVER_HOST_EVENT.RECONNECTED;
    data: ReconnectedData;
}

export interface ReconnectedData {
    room: string;
    id: string;
    users?: string[]; // Array of user ids sent to host
    local?: number; // Number of local users to send to host
}

export interface ClientReconnected extends EventStructure {
    event: SERVER_HOST_EVENT.CLIENT_RECONNECTED;
    data: ClientReconnectedData;
}

export interface ClientReconnectedData {
    room: string;
    id: string;
}

export interface Error extends EventStructure {
    event: SERVER_HOST_EVENT.ERROR;
    data: ErrorData;
}

export interface ErrorData {
    error: ERROR_CODE;
    message?: string;
}

export interface Message extends EventStructure {
    event: SERVER_HOST_EVENT.MESSAGE;
    data: MessageData;
}

export interface MessageData {
    event: string;
    sender: string; // Added by server for client -> host messages
    args: unknown[];
}

export interface Left {
    event: SERVER_HOST_EVENT.LEFT;
    data: LeftData;
}

export interface LeftData {
    id: string;
    reason?: string;
}

export type Event = Created | Joined | Disconnected | ClientDisconnected | Reconnected | ClientReconnected | Error | Message | Left;
