import { PING_EVENT } from "../../common.model";

export enum SERVER_CLIENT_EVENT {
    // Generic Events
    ERROR = 'error',

    // Lipwig events
    JOINED = 'joined',
    MESSAGE = 'lw-message',
    POLL = 'poll',

    // Connection events
    DISCONNECTED = 'disconnected',
    HOST_DISCONNECTED = 'host-disconnected', // Sent to clients in case of unexpected host disconnection
    RECONNECTED = 'reconnected',
    HOST_RECONNECTED = 'host-reconnected',

    // Ping events
    PING_CLIENT = PING_EVENT.PONG_CLIENT,
    PONG_HOST = PING_EVENT.PONG_HOST,
    PONG_SERVER = PING_EVENT.PONG_SERVER
}

