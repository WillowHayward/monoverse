import { UserOptions } from "../common.model";
import { CLIENT_EVENT } from "./client.model";

/**
 * @author: WillHayCode
 */
interface EventStructure {
    event: CLIENT_EVENT,
}

export interface Join extends EventStructure {
    event: CLIENT_EVENT.JOIN;
    data: JoinData;
}

export interface JoinData {
    code: string;
    options?: UserOptions;
}

export interface Leave extends EventStructure {
    event: CLIENT_EVENT.LEAVE;
}

export interface Message extends EventStructure {
    event: CLIENT_EVENT.MESSAGE;
    data: MessageData;
}

export interface MessageData {
    event: string;
    args: unknown[];
}

export interface Ping extends EventStructure {
    event: CLIENT_EVENT.PING;
    data: PingData;
}

export interface PingData {
    time: number;
}

export interface Reconnect extends EventStructure {
    event: CLIENT_EVENT.RECONNECT;
    data: ReconnectData;
}

export interface ReconnectData {
    code: string;
    id: string;
}

export type Event = Join | Leave | Message | Ping | Reconnect;

