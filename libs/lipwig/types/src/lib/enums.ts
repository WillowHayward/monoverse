/**
 * @author: WillHayCode
 */

// Events that can be sent from the server
export enum ServerEvent {
    CREATED = 'created',
    JOINED = 'joined',
    RECONNECTED = 'reconnected',
    ERROR = 'error',
    MESSAGE = 'message'
}

// Events that can be sent from a client
export enum ClientEvent {
    CREATE = 'create',
    JOIN = 'join',
    RECONNECT = 'reconnect',
    CLOSE = 'close',
    ADMINISTRATE = 'administrate',
    MESSAGE = 'message',
    PING = 'lw-ping'
}

export enum ErrorCode {
    SUCCESS,
    MALFORMED,
    ROOMNOTFOUND,
    ROOMFULL,
    USERNOTFOUND,
    INSUFFICIENTPERMISSIONS,
    INCORRECTPASSWORD
}

