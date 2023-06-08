import { v4 } from 'uuid';
import {
    SERVER_EVENT,
    ServerEvent,
    CreatedEvent,
    JoinedEvent,
    RoomConfig,
    UserOptions,
    ClientMessageEventData,
    ServerMessageEvent,
} from '@whc/lipwig/types';
import { LipwigSocket } from '../app/app.model';
import { Logger } from '@nestjs/common';

export class Room {
    private id = v4();
    private users: string[] = []; // Array of user ids, index 0 for host
    private connected: LipwigSocket[] = [];
    private disconnected: string[] = [];

    constructor(
        private host: LipwigSocket,
        public code: string,
        private config: RoomConfig
    ) {
        // TODO: Room config
        this.initialiseUser(host, true);
        const confirmation: CreatedEvent = {
            event: SERVER_EVENT.CREATED,
            data: {
                code,
                id: host.id,
            },
        };

        this.sendMessage(host, confirmation);
    }

    join(client: LipwigSocket, options: UserOptions) {
        // TODO: Join data
        this.initialiseUser(client, false);
        const id = client.id;
        this.connected.push(client);

        const confirmation: JoinedEvent = {
            event: SERVER_EVENT.JOINED,
            data: {
                id,
            },
        };

        this.sendMessage(client, confirmation);

        confirmation.data.options = options;
        this.sendMessage(this.host, confirmation);
    }

    disconnect(user: LipwigSocket, permanent: boolean) {
        if (permanent) {
            // Delete from room
        }

        const id = user.id;
        const index = this.connected.findIndex(value => value === user);
        if (!index) {
            // ???
        }
        this.connected.splice(index, 1);

        this.disconnected.push(id);
        // TODO: Send messages
    }

    reconnect(user: LipwigSocket, id: string) {
        const disconnectedIndex = this.disconnected.indexOf(id);
        if (disconnectedIndex === -1) {
            return;
        }

        if (this.host.id === id) {
            this.host = user;
        } else {
            this.connected[id] = user;
        }

        this.disconnected.splice(disconnectedIndex, 1);
    }

    handleMessage(sender: LipwigSocket, data: ClientMessageEventData) {
        if (sender.id !== this.host.id) {
            // If not host
            const message: ServerMessageEvent = {
                event: SERVER_EVENT.MESSAGE,
                data: {
                    event: data.event,
                    sender: sender.id,
                    args: data.args
                }

            }
            this.sendMessage(this.host, message);
            return;
        }

        for (const id of data.recipient) {
            //TODO: Disconnected message queuing
            const user = this.connected.find(value => id === value.id);
            if (!user) {
                // stub
                Logger.warn('Could not find user', id);
            }
            const message: ServerMessageEvent = {
                event: SERVER_EVENT.MESSAGE,
                data: {
                    event: data.event,
                    args: data.args
                }
            }

            this.sendMessage(user, message);
        }
    }

    private sendMessage(user: LipwigSocket, message: ServerEvent) {
        const messageString = JSON.stringify(message);
        user.send(messageString);
    }

    private initialiseUser(user: LipwigSocket, host: boolean, id?: string) {
        user.host = host;
        user.room = this.code;
        user.id = id || v4();
        if (!host) {
            this.users.push(user.id);
        }
    }
}
