import { SERVER_HOST_EVENT } from "../common.model";
import { EventStructure } from "./structure.model";

export interface PingHost extends EventStructure {
    event: SERVER_HOST_EVENT.PING_HOST;
    data: PingHostData;
}

export interface PingHostData {
    time: number;
    id: string;
}

export interface PongClient extends EventStructure {
    event: SERVER_HOST_EVENT.PONG_CLIENT;
    data: PongClientData;
}

export interface PongClientData {
    time: number;
    id: string;
}

export interface PongServer extends EventStructure {
    event: SERVER_HOST_EVENT.PONG_SERVER;
    data: PongServerData;
}

export interface PongServerData {
    time: number;
}

