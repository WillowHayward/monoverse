import { SERVER_CLIENT_EVENT } from "../common.model";
import { EventStructure } from './structure.model';

// Server -> Client events specific to connections
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

