// Server -> Host events relating to connection
import { EventStructure } from './structure.model';
import { SERVER_HOST_EVENT } from '../common.model';

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
    users?: string[]; // Array of user ids 
    local?: string[]; // Array of local user ids
}

export interface ClientReconnected extends EventStructure {
    event: SERVER_HOST_EVENT.CLIENT_RECONNECTED;
    data: ClientReconnectedData;
}

export interface ClientReconnectedData {
    room: string;
    id: string;
}


