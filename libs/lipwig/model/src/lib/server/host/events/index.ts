import {
    Error
} from './generic.model';
import {
    Created, Joined, Left, Message
} from './lipwig.model';
import {
    Disconnected, ClientDisconnected, Reconnected, ClientReconnected
} from './connection.model';
import {
    PingHost, PongClient, PongServer
} from './ping.model';
export * from './generic.model';
export * from './lipwig.model'
export * from './connection.model';
export * from './ping.model';

export type Event = 
    // Generic Events
    Error |
    // Lipwig Events
    Created | Joined | Left | Message |
    // Connection Events
    Disconnected | ClientDisconnected | Reconnected | ClientReconnected |
    // Ping Events
    PingHost | PongClient | PongServer;
