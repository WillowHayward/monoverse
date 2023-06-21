// Server -> Host events relating to lipwig core functionality
import { EventStructure } from './structure.model';
import { SERVER_HOST_EVENT } from '../common.model';

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
    data?: {[index: string]: any}
}

export interface JoinRequest extends EventStructure {
    event: SERVER_HOST_EVENT.JOIN_REQUEST;
    data: JoinRequestData;
}

export interface JoinRequestData {
    id: string;
    data?: {[index: string]: any}
}

export interface Left {
    event: SERVER_HOST_EVENT.LEFT;
    data: LeftData;
}

export interface LeftData {
    id: string;
    reason?: string;
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

export interface PollResponse extends EventStructure {
    event: SERVER_HOST_EVENT.POLL_RESPONSE;
    data: PollResponseData;
}

export interface PollResponseData {
    id: string;
    client: string;
    response: any;
}

