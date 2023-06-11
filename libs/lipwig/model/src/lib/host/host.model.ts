/**
 *
 * @author: Willow Hayward, whc.fyi
 */
// Events sent from a Host to the Server
export enum HOST_EVENT {
    CREATE = 'create',
    MESSAGE = 'lw-message',
    KICK = 'lw-kick',
    RECONNECT = 'reconnect',
    LOCAL_JOIN = 'lw-local-join', // Used to register local client
    LOCAL_LEAVE = 'lw-local-leave', // Used to remove local client
    PING = 'lw-ping',
    PONG = 'lw-pong',
}

