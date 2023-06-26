export type CreateOptions = Partial<{
    size: number;
    name: string;
    password: string;
    approvals: boolean; // True for Host manually approving join requests
    required: string[]; // List of required paramaters to join a room
    reconnect: {
        code: string;
        id: string;
    };
}>;

export type JoinOptions = Partial<{
    data: {
        [index: string]: unknown;
    }
    password: string;
    reconnect: string;
}>;

export type RoomQuery = Partial<{
    room: string;
    exists: boolean;
    name: string;
    protected: boolean; // Password protected
    capacity: number; // Slots remaining
    locked: boolean;
    lockReason?: string;
}>

export enum GENERIC_EVENT {
    QUERY = 'query'
}

export enum ERROR_CODE {
    SUCCESS = 'SUCCESS',
    MALFORMED = 'MALFORMED',
    USERNOTFOUND = 'USERNOTFOUND',
    INSUFFICIENTPERMISSIONS = 'INSUFFICIENTPERMISSIONS',
    // Room join erros
    ROOMNOTFOUND = 'ROOMNOTFOUND',
    ROOMFULL = 'ROOMFULL',
    ROOMCLOSED = 'ROOMCLOSED',
    ROOMLOCKED = 'ROOMLOCKED',
    INCORRECTPASSWORD = 'INCORRECTPASSWORD',
    MISSINGPARAM = 'MISSINGPARAM',
    REJECTED = 'REJECTED',
    // Poll errors
    POLLCLOSED = 'POLLCLOSED',
    POLLALREADYRESPONSED = 'POLLALREADYRESPONSED',
    POLLUSERNOTFOUND = 'POLLUSERNOTFOUND',
    POLLNOTFOUND = 'POLLNOTFOUND',
}

// 3000-3999 reserved close codes https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code
export enum CLOSE_CODE {
    KICKED = 3400,
    CLOSED = 3401,
    LEFT = 3402,
    QUERY_COMPLETE = 3403,
}

export enum PING_EVENT {
    PING_SERVER = 'lw-ping-server',
    PONG_SERVER = 'lw-pong-server',
    PING_HOST = 'lw-ping-host',
    PONG_HOST = 'lw-pong-host',
    PING_CLIENT = 'lw-ping-client',
    PONG_CLIENT = 'lw-pong-client',
}

