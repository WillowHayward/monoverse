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
    PING_HOST = 'lw-ping-host',
    PONG_CLIENT = 'lw-pong-client',
    PONG_SERVER = 'lw-pong-server',
}

