import { v4 } from 'uuid';
import {
    SERVER_EVENT,
    ServerEvent,
    CreatedEvent,
    JoinedEvent,
    LipwigMessageEventData,
    RoomConfig,
    UserOptions,
} from '@whc/lipwig/types';
import { LipwigSocket } from '../lipwig.model';

export class Room {
    private id = v4();
    private users: string[] = []; // Array of user ids, index 0 for host
    private connected: { [id: string]: LipwigSocket } = {};
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
        this.connected[id] = client;

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

        console.log(this.host.id);
        const id = user.id;
        delete this.connected[id];
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

    handleMessage(user: LipwigSocket, data: LipwigMessageEventData) {
        if (user.id !== this.host.id) {
            // If not host
            this.sendMessage(this.host, {
                event: SERVER_EVENT.MESSAGE,
                data,
            });
            return;
        }

        for (const id of data.recipient) {
            //TODO: Disconnected message queuing
            const user = this.connected[id];
            if (!user) {
                // stub
            }

            this.sendMessage(user, {
                event: SERVER_EVENT.MESSAGE,
                data,
            });
            return;
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
        this.users.push(user.id);
    }
}
