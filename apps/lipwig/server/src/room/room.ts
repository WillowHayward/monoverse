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
    ErrorEvent,
    ERROR_CODE,
} from '@whc/lipwig/types';
import { LipwigSocket } from '../app/app.model';
import { sendError } from './utils';

export class Room {
    private id = v4();
    private users: LipwigSocket[] = []; 

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

    disconnect(user: LipwigSocket) {
        user.connected = false;
    }

    reconnect(user: LipwigSocket, id: string): boolean {
        user.id = id;
        user.room = this.code;

        const reconnectMessage: ReconnectedEvent = {
            event: SERVER_EVENT.RECONNECTED,
            data: {
                room: this.code,
                id
            }
        }

        if (id === this.host.id) {
            this.host = user;
            reconnectMessage.data.users = this.users.map(user => user.id);
            this.send<ReconnectedEvent>(user, reconnectMessage);
        } else {
            if (!this.reconnectUser(user)) {
                return false;
            }

            this.send<ReconnectedEvent>(user, reconnectMessage);
            // Send to user first to allow listeners to be in localhost
            // TODO: This may still introduce a race condition
            this.send<ReconnectedEvent>(this.host, reconnectMessage);
        }

        user.connected = true;

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

        return true;
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

    private send<T extends ServerEvent>(user: LipwigSocket, message: T) {
        const messageString = JSON.stringify(message);
        user.send(messageString);
    }
}
