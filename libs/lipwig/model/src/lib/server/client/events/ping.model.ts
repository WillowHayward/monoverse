import { SERVER_CLIENT_EVENT } from "../common.model";
import { EventStructure } from "./structure.model";

export interface PingClient extends EventStructure {
    event: SERVER_CLIENT_EVENT.PING_CLIENT;
    data: PingClientData;
}

export interface PingClientData {
    time: number;
}

export interface PongHost extends EventStructure {
    event: SERVER_CLIENT_EVENT.PONG_HOST;
    data: PongHostData;
}

export interface PongHostData {
    time: number;
}

export interface PongServer extends EventStructure {
    event: SERVER_CLIENT_EVENT.PONG_SERVER;
    data: PongServerData;
}

export interface PongServerData {
    time: number;
}

