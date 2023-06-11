/**
 * @author: WillHayCode
 */

// Events that can be sent from the server
export enum SERVER_EVENT {
    CREATED = 'created',
    JOINED = 'joined',
    DISCONNECTED = 'disconnected',
    HOST_DISCONNECTED = 'host-disconnected', // Sent to clients in case of unexpected host disconnection
    RECONNECTED = 'reconnected',
    HOST_RECONNECTED = 'host-reconnected',
    ERROR = 'error',
    MESSAGE = 'lw-message',
    KICKED = 'kicked',
    CLOSED = 'closed',
    LEFT = 'left',
}

// Events that can be sent from a client
export enum CLIENT_EVENT {
    CREATE = 'create',
    JOIN = 'join',
    RECONNECT = 'reconnect',
    CLOSE = 'close',
    LEAVE = 'leave',
    ADMINISTRATE = 'administrate',
    MESSAGE = 'lw-message',
    PING = 'lw-ping',
    KICK = 'lw-kick',
    LOCAL_JOIN = 'lw-local-join', // Used to register local client
    LOCAL_LEAVE = 'lw-local-leave', // Used to remove local client
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
