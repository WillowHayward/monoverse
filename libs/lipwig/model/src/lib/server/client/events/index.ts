import { Error, ErrorData } from './generic.model';
import { Joined, JoinedData, Message, MessageData } from './lipwig.model';
import { Disconnected, HostDisconnected, Reconnected, HostReconnected, DisconnectedData, HostReconnectedData } from './connection.model';
import { PingClient, PingClientData, PongHost, PongHostData, PongServer, PongServerData } from './ping.model';
import { ReconnectData } from '../../../host/events.model';

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

export type EventData =
    // Generic Events
    ErrorData |
    // Lipwig Events
    JoinedData | MessageData |
    // Connection Events
    DisconnectedData | /* HostDisconnectedData | */ ReconnectData | HostReconnectedData |
    // Ping Events
    PingClientData | PongHostData | PongServerData;
