/**
 *
 * @author: Willow Hayward, whc.fyi
 */

import { PING_EVENT } from "../common.model";

// Events sent from a Host to the Server
export enum HOST_EVENT {
    CREATE = 'create',
    JOIN_RESPONSE = 'join-response',
    LOCK = 'lock',
    UNLOCK = 'unlock',
    MESSAGE = 'lw-message',
    POLL = 'poll',
    KICK = 'lw-kick',
    RECONNECT = 'reconnect',
    LOCAL_JOIN = 'lw-local-join', // Used to register local client
    LOCAL_LEAVE = 'lw-local-leave', // Used to remove local client
    PING_SERVER = PING_EVENT.PING_SERVER,
    PING_CLIENT = PING_EVENT.PING_CLIENT,
    PONG_HOST = PING_EVENT.PONG_HOST,
}

