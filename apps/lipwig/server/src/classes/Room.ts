import { v4 } from 'uuid';
import {
    SERVER_HOST_EVENT,
    SERVER_CLIENT_EVENT,
    ERROR_CODE,
    CLOSE_CODE,
    HostEvents,
    ClientEvents,
    CreateOptions,
    JoinOptions
} from '@whc/lipwig/model';
import { LipwigSocket } from './LipwigSocket';
import { Logger } from '@nestjs/common';

export class Room {
    private id = v4();

    private password?: string;
    private size: number;

    private users: LipwigSocket[] = [];
    private localUsers: string[] = [];
    // TODO: This feels hacky
    public onclose: () => void;
    public closed: boolean = false;

    constructor(
        private host: LipwigSocket,
        public code: string,
        private config: CreateOptions,
    ) {
        // TODO: Room config
        this.initialiseHost(host);
        Logger.debug(`${this.code} created by ${host.id}`, this.id);

        if (config.password && config.password.length) {
            this.password = config.password;
        }

        this.size = config.size || 8; //TODO: Turn default into config

        host.send({
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

    private initialiseClient(client: LipwigSocket) {
        const id = v4();
        client.initialize(id, false, this);
        client.on('leave', (reason?: string) => {
            this.leave(client, reason);
        });

        client.on('disconnect', () => {
            this.disconnect(client);
        });
    }

    private initialiseHost(host: LipwigSocket) {
        const id = v4();
        host.initialize(id, true, this);

        host.on('close', (reason?: string) => {
            this.close(reason);
        });

        host.on('disconnect', () => {
            this.disconnect(host);
        });
    }

    join(client: LipwigSocket, options: JoinOptions) {
        if (this.password) {
            if (!options.password) {
                client.error(ERROR_CODE.INCORRECTPASSWORD, 'Password required');
                return;
            }
            if (this.password.localeCompare(options.password) !== 0) {
                client.error(ERROR_CODE.INCORRECTPASSWORD);
                return;
            }
        }

        const currentSize = this.users.length + this.localUsers.length;
        if (currentSize >= this.size) {
            client.error(ERROR_CODE.ROOMFULL);
            return;
        }

        this.initialiseClient(client);
        const id = client.id;
        this.users.push(client);

        client.send({
            event: SERVER_CLIENT_EVENT.JOINED,
            data: {
                id,
            },
        });

        this.host.send({
            event: SERVER_HOST_EVENT.JOINED,
            data: {
                id,
                data: options?.data
            },
        });
        Logger.debug(`${id} joined`, this.id);
    }

    private disconnect(disconnected: LipwigSocket) {
        disconnected.connected = false;
        if (disconnected.isHost) {
            for (const user of this.users) {
                user.send({
                    event: SERVER_CLIENT_EVENT.HOST_DISCONNECTED,
                });
            }
        } else {
            this.host.send({
                event: SERVER_HOST_EVENT.CLIENT_DISCONNECTED,
                data: {
                    id: disconnected.id,
                },
            });
        }
    }

    reconnect(user: LipwigSocket, id: string): boolean {
        if (this.isHost(id)) {
            if (!this.reconnectHost(user, id)) {
                return false;
            }
        } else {
            if (!this.reconnectUser(user, id)) {
                return false;
            }
        }

        user.connected = true;

        return true;
    }

    private reconnectHost(host: LipwigSocket, id: string): boolean {
        this.host = host;
        host.initialize(id, true, this);

        host.send({
            event: SERVER_HOST_EVENT.RECONNECTED,
            data: {
                room: this.code,
                id: host.id,
                users: this.users.map((user) => user.id),
                local: this.localUsers,
            },
        });

        for (const user of this.users) {
            user.send({
                event: SERVER_CLIENT_EVENT.HOST_RECONNECTED,
                data: {
                    room: this.code,
                    id: host.id,
                },
            });
        }

        Logger.debug(`Host reconnected`, this.id);

        return true;
    }

    private reconnectUser(user: LipwigSocket, id: string): boolean {
        const index = this.users.findIndex((other) => other.id === id);
        if (index === -1) {
            // Could not find user
            user.error(ERROR_CODE.USERNOTFOUND);
            return false;
        }

        user.initialize(id, false, this);

        this.users.splice(index, 1, user);

        user.send({
            event: SERVER_CLIENT_EVENT.RECONNECTED,
            data: {
                room: this.code,
                id
            },
        });
        // Send to user first to allow listeners to be in localhost
        // TODO: This may still introduce a race condition
        this.host.send({
            event: SERVER_HOST_EVENT.CLIENT_RECONNECTED,
            data: {
                room: this.code,
                id: user.id,
            },
        });

        Logger.debug(`${id} reconnected`, this.id);

        return true;
    }

    close(reason?: string) {
        this.closed = true;
        for (const user of this.users) {
            user.close(CLOSE_CODE.CLOSED, reason);
        }

        if (reason) {
            Logger.debug(`Closed - ${reason}`, this.id);
        } else {
            Logger.debug('Closed', this.id);
        }

        if (this.onclose) {
            this.onclose();
        }
    }

    leave(user: LipwigSocket, reason?: string) {
        this.host.send({
            event: SERVER_HOST_EVENT.LEFT,
            data: {
                id: user.id,
                reason
            }
        });

        const index = this.users.indexOf(user);
        if (index === -1) {
            // TODO: Handle
            return;
        }

        if (reason) {
            Logger.debug(`${user.id} left - ${reason}`, this.id);
        } else {
            Logger.debug(`${user.id} left`, this.id);
        }

        this.users.splice(index, 1);
    }

    kick(user: LipwigSocket, id: string, reason?: string) {
        if (!user.isHost) {
            user.error(ERROR_CODE.INSUFFICIENTPERMISSIONS);
            return;
        }

        const target = this.users.find((user) => user.id === id);
        const index = this.users.indexOf(target);
        if (!target || index === -1) {
            user.error(ERROR_CODE.USERNOTFOUND);
        }

        if (reason) {
            Logger.debug(`${id} kicked - ${reason}`, this.id);
        } else {
            Logger.debug(`${id} kicked`, this.id);
        }

        target.close(CLOSE_CODE.KICKED, reason);
        this.users.splice(index, 1);
    }

    //administrate(user: LipwigSocket, payload: AdministrateEventData) {}

    handle(sender: LipwigSocket, data: HostEvents.MessageData | ClientEvents.MessageData) {
        if (sender.isHost) {
            this.handleHost(sender, data as HostEvents.MessageData);
        } else {
            this.handleClient(sender, data as ClientEvents.MessageData);
        }
    }

    private handleHost(host: LipwigSocket, data: HostEvents.MessageData) {
        Logger.debug(`Received '${data.event}' message from host`, this.id);
        for (const id of data.recipients) {
            //TODO: Disconnected message queuing
            const user = this.users.find((value) => id === value.id);
            if (!user) {
                host.error(ERROR_CODE.USERNOTFOUND);
                continue;
            }

            user.send({
                event: SERVER_CLIENT_EVENT.MESSAGE,
                data: {
                    event: data.event,
                    args: data.args,
                },
            });
        }
    }

    private handleClient(client: LipwigSocket, data: ClientEvents.MessageData) {
        Logger.debug(`Received '${data.event}' message from ${client.id}`, this.id);
        this.host.send({
            event: SERVER_HOST_EVENT.MESSAGE,
            data: {
                event: data.event,
                sender: client.id,
                args: data.args,
            },
        });
    }

    pingHost(socket: LipwigSocket, time: number) {
        const id = socket.id;

        this.host.send({
            event: SERVER_HOST_EVENT.PING_HOST,
            data: {
                time, id
            }
        });

    }

    pongHost(socket: LipwigSocket, time: number, id: string) {
        const user = this.users.find(user => user.id === id);

        if (!user) {
            socket.error(ERROR_CODE.USERNOTFOUND);
            return;
        }
        
        user.send({
            event: SERVER_CLIENT_EVENT.PONG_HOST,
            data: {
                time
            }
        });
    }

    pingClient(socket: LipwigSocket, time: number, id: string) {
        const user = this.users.find(user => user.id === id);

        if (!user) {
            socket.error(ERROR_CODE.USERNOTFOUND);
            return;
        }

        user.send({
            event: SERVER_CLIENT_EVENT.PING_CLIENT,
            data: {
                time
            }
        });
    }

    pongClient(socket: LipwigSocket, time: number) {
        const id = socket.id;

        this.host.send({
            event: SERVER_HOST_EVENT.PONG_CLIENT,
            data: {
                time,
                id
            }
        });
    }

    localJoin(user: LipwigSocket, id: string) {
        Logger.debug(`${id} joined (local)`, this.id);
        this.localUsers.push(id);
    }

    localLeave(user: LipwigSocket, id: string) {
        const index = this.localUsers.indexOf(id);

        if (index === -1) {
            user.error(ERROR_CODE.USERNOTFOUND, `Local user ${id} not found`);
        }

        this.localUsers.splice(index, 1);
        Logger.debug(`${id} left (local)`, this.id);
    }
}
