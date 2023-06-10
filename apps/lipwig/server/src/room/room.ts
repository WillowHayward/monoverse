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

        this.sendMessage<CreatedEvent>(host, {
            event: SERVER_EVENT.CREATED,
            data: {
                code,
                id: host.id,
            },
        });
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

        this.sendMessage<JoinedEvent>(client, confirmation);

        confirmation.data.options = options;
        this.sendMessage<JoinedEvent>(this.host, confirmation);
    }

    disconnect(user: LipwigSocket, permanent: boolean) {
        console.log('Disconnect');
        if (permanent) {
            // Delete from room
        }

        if (user === this.host) {

            return;
        }

        const id = user.id;
        const index = this.connected.findIndex(value => value === user);
        if (!index) {
            // ???
        }
        //this.connected.splice(index, 1);

        this.disconnected.push(id);
        // TODO: Send messages
    }

    reconnect(user: LipwigSocket, id: string) {
        user.id = id;
        user.room = this.code;
        if (id === this.host.id) {
            Logger.log('Host reconnected');
            this.host = user;
        } else {
            if (!this.reconnectUser(user)) {
                console.log('Could not reconnect');
                return;
            }
        }

        this.sendMessage<ReconnectedEvent>(user, {
            event: SERVER_EVENT.RECONNECTED,
            data: {}
        });
    }


    private reconnectUser(user: LipwigSocket): boolean {
        const id = user.id;
        const disconnectedIndex = this.disconnected.indexOf(id);
        if (disconnectedIndex === -1) {
            console.log('A');
            return false;
        }

        const connectedIndex = this.connected.findIndex(value => value.id === id);
        if (connectedIndex === -1) {
            console.log('B');
            return false;
        }

        this.disconnected.splice(disconnectedIndex, 1);
        this.connected[connectedIndex] = user;

        return true;
    }

    handleMessage(sender: LipwigSocket, data: ClientMessageEventData) {
        if (sender.id !== this.host.id) {
            // If not host
            this.sendMessage<ServerMessageEvent>(this.host, {
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
            const user = this.connected.find(value => id === value.id);
            if (!user) {
                // stub
                Logger.warn('Could not find user', id);
            }

            this.sendMessage<ServerMessageEvent>(user, {
                event: SERVER_EVENT.MESSAGE,
                data: {
                    event: data.event,
                    args: data.args
                }
            });
        }
    }

    private sendMessage<T extends ServerEvent>(user: LipwigSocket, message: T) {
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
