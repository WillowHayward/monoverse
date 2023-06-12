import { Error } from './generic.model';
import { Joined, Message } from './lipwig.model';
import { Disconnected, HostDisconnected, Reconnected, HostReconnected } from './connection.model';
import { PingClient, PongHost, PongServer } from './ping.model';

export * from './generic.model';
export * from './lipwig.model';
export * from './connection.model';
export * from './ping.model';

export type Event = 
    // Generic Events
    Error |
    // Lipwig Events
    Joined | Message |
    // Connection Events
    Disconnected | HostDisconnected | Reconnected | HostReconnected |
    // Ping Events
    PingClient | PongHost | PongServer;


