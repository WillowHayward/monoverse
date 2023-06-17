import { JoinOptions } from "../common.model";
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
    options?: JoinOptions;
}

export interface Message extends EventStructure {
    event: CLIENT_EVENT.MESSAGE;
    data: MessageData;
}

export interface MessageData {
    event: string;
    args: unknown[];
}

export interface PollResponse extends EventStructure {
    event: CLIENT_EVENT.POLL_RESPONSE;
    data: PollResponseData;
}

export interface PollResponseData {
    id: string;
    response: any;
}

export interface Reconnect extends EventStructure {
    event: CLIENT_EVENT.RECONNECT;
    data: ReconnectData;
}

export interface ReconnectData {
    code: string;
    id: string;
}

export interface PingHost extends EventStructure {
    event: CLIENT_EVENT.PING_HOST;
    data: PingHostData;
}

export interface PingHostData {
    time: number;
}

export interface PingServer extends EventStructure {
    event: CLIENT_EVENT.PING_SERVER;
    data: PingServerData;
}

export interface PingServerData {
    time: number;
}

export interface PongClient extends EventStructure {
    event: CLIENT_EVENT.PONG_CLIENT;
    data: PongClientData;
}

export interface PongClientData {
    time: number;
}


export type Event = Join | Message | PollResponse | Reconnect | PingServer | PingHost | PongClient;
export type EventData = JoinData | MessageData | PollResponseData | ReconnectData | PingServerData | PingHostData | PongClientData;

