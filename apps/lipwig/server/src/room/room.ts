import { v4 } from 'uuid';
import {
    SERVER_HOST_EVENT,
    SERVER_CLIENT_EVENT,
    ERROR_CODE,
    HostEvents,
    ClientEvents,
    ServerHostEvents,
    ServerClientEvents,
    RoomConfig,
    UserOptions
} from '@whc/lipwig/model';
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

        this.send<ServerHostEvents.Created>(host, {
            event: SERVER_HOST_EVENT.CREATED,
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

        return this.users.some((user) => id === user.id);
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

        this.send<ServerClientEvents.Joined>(client, {
            event: SERVER_CLIENT_EVENT.JOINED,
            data: {
                id,
            },
        });

        this.send<ServerHostEvents.Joined>(this.host, {
            event: SERVER_HOST_EVENT.JOINED,
            data: {
                id,
                options
            },
        });
    }

    disconnect(disconnected: LipwigSocket) {
        disconnected.connected = false;
        if (this.host.id === disconnected.id) {
            for (const user of this.users) {
                this.send<ServerClientEvents.HostDisconnected>(user, {
                    event: SERVER_CLIENT_EVENT.HOST_DISCONNECTED,
                });
            }
        } else {
            this.send<ServerHostEvents.ClientDisconnected>(this.host, {
                event: SERVER_HOST_EVENT.CLIENT_DISCONNECTED,
                data: {
                    id: disconnected.id,
                },
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
        this.send<ServerHostEvents.Reconnected>(host, {
            event: SERVER_HOST_EVENT.RECONNECTED,
            data: {
                room: this.code,
                id: host.id,
                users: this.users.map((user) => user.id),
                local: this.local,
            },
        });

        for (const user of this.users) {
            this.send<ServerClientEvents.HostReconnected>(user, {
                event: SERVER_CLIENT_EVENT.HOST_RECONNECTED,
                data: {
                    room: this.code,
                    id: host.id,
                },
            });
        }

        return true;
    }

    private reconnectUser(user: LipwigSocket): boolean {
        const index = this.users.findIndex((other) => other.id === user.id);
        if (index === -1) {
            // Could not find user
            sendError(user, ERROR_CODE.USERNOTFOUND);
            return false;
        }

        this.users.splice(index, 1, user);

        this.send<ServerClientEvents.Reconnected>(user, {
            event: SERVER_CLIENT_EVENT.RECONNECTED,
            data: {
                room: this.code,
                id: user.id,
            },
        });
        // Send to user first to allow listeners to be in localhost
        // TODO: This may still introduce a race condition
        this.send<ServerHostEvents.ClientReconnected>(this.host, {
            event: SERVER_HOST_EVENT.CLIENT_RECONNECTED,
            data: {
                room: this.code,
                id: user.id,
            },
        });

        return true;
    }

    close(user: LipwigSocket, payload: HostEvents.CloseData) {}

    leave(user: LipwigSocket, payload: ClientEvents.LeaveData) {}

    //administrate(user: LipwigSocket, payload: AdministrateEventData) {}

    handle(sender: LipwigSocket, data: HostEvents.MessageData | ClientEvents.MessageData) {
        if (sender.id === this.host.id) {
            this.handleHost(sender, data as HostEvents.MessageData);
        } else {
            this.handleClient(sender, data as ClientEvents.MessageData);
        }
    }

    private handleHost(host: LipwigSocket, data: HostEvents.MessageData) {
        for (const id of data.recipients) {
            //TODO: Disconnected message queuing
            const user = this.users.find((value) => id === value.id);
            if (!user) {
                sendError(host, ERROR_CODE.USERNOTFOUND);
                continue;
            }

            this.send<ServerClientEvents.Message>(user, {
                event: SERVER_CLIENT_EVENT.MESSAGE,
                data: {
                    event: data.event,
                    args: data.args,
                },
            });
        }
    }

    private handleClient(client: LipwigSocket, data: ClientEvents.MessageData) {
        this.send<ServerHostEvents.Message>(this.host, {
            event: SERVER_HOST_EVENT.MESSAGE,
            data: {
                event: data.event,
                sender: client.id,
                args: data.args,
            },
        });
    }

    ping(user: LipwigSocket, payload: HostEvents.PingData | ClientEvents.PingData) {}

    kick(user: LipwigSocket, payload: HostEvents.KickData) {
        const target = this.users.find((user) => user.id === payload.id);
        const index = this.users.indexOf(target);
        if (!target || index === -1) {
            sendError(user, ERROR_CODE.USERNOTFOUND);
        }

        this.send<ServerClientEvents.Kicked>(target, {
            event: SERVER_CLIENT_EVENT.KICKED,
            data: {
                reason: payload.reason,
            },
        });
        target.close();
        this.users.splice(index, 1);
    }

    localJoin(user: LipwigSocket) {
        this.local++;
    }

    localLeave(user: LipwigSocket) {}

    private send<T extends ServerHostEvents.Event | ServerClientEvents.Event>(user: LipwigSocket, message: T) {
        const messageString = JSON.stringify(message);
        user.send(messageString);
    }
}
