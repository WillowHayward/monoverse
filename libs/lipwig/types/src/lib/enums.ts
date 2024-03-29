/**
 * @author: WillHayCode
 */

// Events that can be sent from the server
export enum SERVER_EVENT {
    CREATED = 'created',
    JOINED = 'joined',
    RECONNECTED = 'reconnected',
    ERROR = 'error',
    MESSAGE = 'message',
    KICKED = 'kicked',
}

// Events that can be sent from a client
export enum CLIENT_EVENT {
    CREATE = 'create',
    JOIN = 'join',
    RECONNECT = 'reconnect',
    CLOSE = 'close',
    ADMINISTRATE = 'administrate',
    MESSAGE = 'message',
    PING = 'lw-ping',
    KICK = 'kick',
}

export enum ERROR_CODE {
    SUCCESS,
    MALFORMED,
    ROOMNOTFOUND,
    ROOMFULL,
    USERNOTFOUND,
    INSUFFICIENTPERMISSIONS,
    INCORRECTPASSWORD,
}
