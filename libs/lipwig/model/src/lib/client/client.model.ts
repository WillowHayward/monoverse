export const DEFAULTS = {
    port: 8989,
};

export enum CLIENT_EVENT {
    JOIN = 'join',
    MESSAGE = 'lw-message',
    RECONNECT = 'reconnect',
    PING_HOST = 'lw-ping-host',
    PING_SERVER = 'lw-ping-server',
    PONG_CLIENT = 'lw-pong-client',
}

