export type LipwigOptions = {
    port: number;
    roomNumberLimit: number;
    roomSizeLimit: number;
    name: string;
    db: string;
};

export type LipwigConfig = Partial<LipwigOptions>;

export enum SERVER_HOST_EVENT {
    CREATED = 'created',
    JOINED = 'joined',
    DISCONNECTED = 'disconnected',
    CLIENT_DISCONNECTED = 'client-disconnected', // Sent to host in case of unexpected client disconnection
    RECONNECTED = 'reconnected',
    CLIENT_RECONNECTED = 'client-reconnected',
    ERROR = 'error',
    MESSAGE = 'lw-message',
    LEFT = 'left',
}

export enum SERVER_CLIENT_EVENT {
    JOINED = 'joined',
    DISCONNECTED = 'disconnected',
    HOST_DISCONNECTED = 'host-disconnected', // Sent to clients in case of unexpected host disconnection
    RECONNECTED = 'reconnected',
    HOST_RECONNECTED = 'host-reconnected',
    ERROR = 'error',
    MESSAGE = 'lw-message',
    KICKED = 'kicked',
    CLOSED = 'closed',
}

