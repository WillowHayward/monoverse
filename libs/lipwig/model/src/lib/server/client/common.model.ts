export enum SERVER_CLIENT_EVENT {
    // Generic Events
    ERROR = 'error',

    // Lipwig events
    JOINED = 'joined',
    MESSAGE = 'lw-message',

    // Connection events
    DISCONNECTED = 'disconnected',
    HOST_DISCONNECTED = 'host-disconnected', // Sent to clients in case of unexpected host disconnection
    RECONNECTED = 'reconnected',
    HOST_RECONNECTED = 'host-reconnected',

    // Ping events
    PING_CLIENT = 'lw-ping-client',
    PONG_HOST = 'lw-pong-host',
    PONG_SERVER = 'lw-pong-server'
}

