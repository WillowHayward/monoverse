import { v4 } from 'uuid';
import {
    SERVER_EVENT,
    ServerEvent,
    CreatedEvent,
    ReconnectedEvent,
    JoinedEvent,
    RoomConfig,
    UserOptions,
    ClientMessageEventData,
    ServerMessageEvent,
    ERROR_CODE,
    CloseEventData,
    LeaveEventData,
    AdministrateEventData,
    PingEventData,
    KickEventData,
    HostDisconnectedEvent,
    DisconnectedEvent,
    HostReconnectedEvent,
    LocalJoinEventData,
    LocalLeaveEventData,
} from '@whc/lipwig/types';
import { LipwigSocket } from '../app/app.model';
import { sendError } from './utils';

export class Room {
    private id = v4();
    private users: LipwigSocket[] = []; 
    private local: number = 0;

    constructor(
        private host: LipwigSocket,
        public code: string,
        private config: RoomConfig
    ) {
        // TODO: Room config
        this.initialiseUser(host, true);

        this.send<CreatedEvent>(host, {
            event: SERVER_EVENT.CREATED,
            data: {
                code,
                id: host.id,
            },
        });
    }

    inRoom(id: string) {
        if (this.isHost(id)) {
            return true;
        }

        return this.users.some(user => id === user.id);
    }

    isHost(id: string) {
        return id === this.host.id;
    }

    private initialiseUser(user: LipwigSocket, host: boolean, id?: string) {
        user.host = host;
        user.room = this.code;
        user.id = id || v4();
        user.connected = true;
        if (!host) {
            this.users.push(user);
        }
    }

    join(client: LipwigSocket, options: UserOptions) {
        // TODO: Join data
        this.initialiseUser(client, false);
        const id = client.id;
        this.users.push(client);

        const confirmation: JoinedEvent = {
            event: SERVER_EVENT.JOINED,
            data: {
                id,
            },
        };

        this.send<JoinedEvent>(client, confirmation);

        confirmation.data.options = options;
        this.send<JoinedEvent>(this.host, confirmation);
    }

    disconnect(disconnected: LipwigSocket) {
        disconnected.connected = false;
        if (this.host.id === disconnected.id) {
            for (const user of this.users) {
                this.send<HostDisconnectedEvent>(user, {
                    event: SERVER_EVENT.HOST_DISCONNECTED,
                    data: {}
                })
            }
        } else {
            this.send<DisconnectedEvent>(this.host, {
                event: SERVER_EVENT.DISCONNECTED,
                data: {
                    id: disconnected.id
                }
            });
        }
    }

    reconnect(user: LipwigSocket, id: string): boolean {
        user.id = id;
        user.room = this.code;

        if (id === this.host.id) {
            if (!this.reconnectHost(user)) {
                return false;
            }
        } else {
            if (!this.reconnectUser(user)) {
                return false;
            }
        }

        user.connected = true;

        return true;
    }

    private reconnectHost(host: LipwigSocket): boolean {
        this.host = host;
        this.send<HostReconnectedEvent>(host, {
            event: SERVER_EVENT.HOST_RECONNECTED,
            data: {
                room: this.code,
                id: host.id,
                users: this.users.map(user => user.id),
                local: this.local
            }
        });

        for (const user of this.users) {
            this.send<HostReconnectedEvent>(user, {
                event: SERVER_EVENT.HOST_RECONNECTED,
                data: {
                    room: this.code,
                    id: host.id
                }
            });
        }

        return true;
    }


    private reconnectUser(user: LipwigSocket): boolean {
        const index = this.users.findIndex(other => other.id === user.id);
        if (index === -1) {
            // Could not find user
            sendError(user, ERROR_CODE.USERNOTFOUND);
            return false;
        }

        this.users.splice(index, 1, user);

        const reconnectMessage: ReconnectedEvent = {
            event: SERVER_EVENT.RECONNECTED,
            data: {
                room: this.code,
                id: user.id
            }
        }

        this.send<ReconnectedEvent>(user, reconnectMessage);
        // Send to user first to allow listeners to be in localhost
        // TODO: This may still introduce a race condition
        this.send<ReconnectedEvent>(this.host, reconnectMessage);

        return true;
    }

    close(user: LipwigSocket, payload: CloseEventData) {

    }

    leave(user: LipwigSocket, payload: LeaveEventData) {

    }

    administrate(user: LipwigSocket, payload: AdministrateEventData) {

    }

    handle(sender: LipwigSocket, data: ClientMessageEventData) {
        if (sender.id !== this.host.id) {
            // If not host
            this.send<ServerMessageEvent>(this.host, {
                event: SERVER_EVENT.MESSAGE,
                data: {
                    event: data.event,
                    sender: sender.id,
                    args: data.args
                }
            });
            return;
        }

        for (const id of data.recipients) {
            //TODO: Disconnected message queuing
            const user = this.users.find(value => id === value.id);
            if (!user) {
                sendError(sender, ERROR_CODE.USERNOTFOUND);
                continue;
            }

            this.send<ServerMessageEvent>(user, {
                event: SERVER_EVENT.MESSAGE,
                data: {
                    event: data.event,
                    args: data.args
                }
            });
        }
    }

    ping(user: LipwigSocket, payload: PingEventData) {

    }

    kick(user: LipwigSocket, payload: KickEventData) {

    }

    localJoin(user: LipwigSocket, payload: LocalJoinEventData) {
        this.local++;
    }

    localLeave(user: LipwigSocket, payload: LocalLeaveEventData) {

    }

    private send<T extends ServerEvent>(user: LipwigSocket, message: T) {
        const messageString = JSON.stringify(message);
        user.send(messageString);
    }
}
