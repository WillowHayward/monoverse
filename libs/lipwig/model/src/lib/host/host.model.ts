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
    PING_SERVER = 'lw-ping-server',
    PING_CLIENT = 'lw-ping-client',
    PONG_HOST = 'lw-pong-host',
}

