/**
 * @author: WillHayCode
 */

// Events that can be sent from the server
export enum SERVER_EVENT {
    CREATED = 'created',
    JOINED = 'joined',
    RECONNECTED = 'reconnected',
    ERROR = 'error',
    MESSAGE = 'lw-message',
    KICKED = 'kicked',
}

// Events that can be sent from a client
export enum CLIENT_EVENT {
    CREATE = 'create',
    JOIN = 'join',
    RECONNECT = 'reconnect',
    CLOSE = 'close',
    ADMINISTRATE = 'administrate',
    MESSAGE = 'lw-message',
    PING = 'lw-ping',
    KICK = 'kick',
}

export enum ERROR_CODE {
    SUCCESS = 'SUCCESS',
    MALFORMED = 'MALFORMED',
    ROOMNOTFOUND = 'ROOMNOTFOUND',
    ROOMFULL = 'ROOMFULL',
    USERNOTFOUND = 'USERNOTFOUND',
    INSUFFICIENTPERMISSIONS = 'INSUFFICIENTPERMISSIONS',
    INCORRECTPASSWORD = 'INCORRECTPASSWORD',
}
