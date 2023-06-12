import { PING_EVENT } from "../../common.model";

export enum SERVER_HOST_EVENT {
    // Generic events
    ERROR = 'error',

    // Lipwig events
    CREATED = 'created',
    JOINED = 'joined',
    LEFT = 'left',
    MESSAGE = 'lw-message',

    // Connection events
    DISCONNECTED = 'disconnected',
    CLIENT_DISCONNECTED = 'client-disconnected', // Sent to host in case of unexpected client disconnection
    RECONNECTED = 'reconnected',
    CLIENT_RECONNECTED = 'client-reconnected',

    // Ping events
    PING_HOST = PING_EVENT.PING_HOST,
    PONG_CLIENT = PING_EVENT.PONG_CLIENT,
    PONG_SERVER = PING_EVENT.PONG_SERVER,
}

