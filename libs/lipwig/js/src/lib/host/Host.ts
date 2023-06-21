/**
 * @author: WillHayCode
 */
import {
    HOST_EVENT,
    SERVER_HOST_EVENT,
    SERVER_CLIENT_EVENT,
    CLOSE_CODE,
    HostEvents,
    ServerHostEvents,
    CreateOptions,
    JoinOptions,
    ERROR_CODE
} from '@whc/lipwig/model';
import { User } from './User';
import { LocalClient } from '../client';
import { EventManager } from '../EventManager';
import { Socket } from '../Socket';
import * as Logger from 'loglevel';
import { Group } from './Group';
import { JoinRequest } from './JoinRequest';
import { Poll } from './Poll';

export class Host extends EventManager {
    protected name = 'Host';
    private users: User[] = [];
    private localClients: LocalClient[] = [];
    private groups: Group[] = [];
    private polls: Poll[] = [];

    private socket: Socket;
    public room = '';
    public id = '';

    public locked = false;

    /**
     * Create a new Lipwig room
     * @param url       Websocket url of LipwigCore server
     * @param options   Options with which to create room
     */
    constructor(url: string, public config: CreateOptions = {}) {
        super();

        this.socket = new Socket(url, this.name);

        this.socket.on('connected', () => {
            this.connected();
        });

        this.socket.on('error', () => {
            // TODO
        });

        this.socket.on('lw-error', (error: ERROR_CODE, message?: string) => {
            if (message) {
                Logger.warn(`[${this.name}] Received error ${error} - ${message}`);
            } else {
                Logger.warn(`[${this.name}] Received error ${error}`);
            }

            this.emit('error', error, message);
        });

        this.socket.on('message', (message: ServerHostEvents.Event) => {
            this.handle(message);
        });

        this.socket.on('disconnected', () => {
            // TODO: Reconnection should be handled differently for a disconnect vs a refresh - a flag here might be the go
            this.emit('host-disconnected');
        });

        this.socket.on('reconnected', (socket: Socket) => {
            // TODO: Does this make sense for the Socket class abstraction?
            //this.socket = socket;
        });
    }

    /**
     * @return map of all users in room
     */
    public getUsers(): User[] {
        return this.users.slice();
    }

    public getUser(id: string) {
        return this.users.find(user => id === user.id);
    }

    public sendToAll(event: string, ...args: unknown[]) {
        this.sendTo(event, this.users, ...args);
    }

    public sendToAllExcept(
        event: string,
        except: User | User[],
        ...args: unknown[]
    ) {
        const recipients = this.users.filter((user) => user !== except);

        this.sendTo(event, recipients, ...args);
    }

    public sendToGroup(event: string, group: string | Group, ...args: unknown[]) {
        if (typeof group === 'string') {
            group = this.getGroup(group);
        }

        group.send(event, ...args);
    }

    public sendTo(event: string, users: User | User[], ...args: unknown[]) {
        if (!Array.isArray(users)) {
            users = [users];
        }

        const remoteRecipients = users
            .filter((user) => !user.id.startsWith('local-'))
            .map((user) => user.id);
        if (remoteRecipients.length) {
            this.send({
                event: HOST_EVENT.MESSAGE,
                data: {
                    event,
                    args,
                    recipients: remoteRecipients,
                },
            });
        }

        const localRecipients = users.filter((user) =>
            user.id.startsWith('local-')
        );
        for (const user of localRecipients) {
            user.send(event, ...args);
        }
    }

    protected preSend(message: HostEvents.Event) {
        if (message.event === HOST_EVENT.KICK) {
            // TODO: LocalClient kicking?
            const id = message.data.id;
            const index = this.users.findIndex(user => id === user.id);
            if (index === -1) {
                // TODO: user not found
            } 
            this.users.splice(index, 1);
        }
    }

    public send(message: HostEvents.Event) {
        this.preSend(message);
        this.socket.send(message);
    }

    public poll(users: User[], query: string, id?: string): Poll {
        const poll = new Poll(this, users, query, id);
        this.polls.push(poll);
        return poll;
    }

    public createLocalClient(
        options: JoinOptions = {},
    ): LocalClient {
        return new LocalClient(this, this.room, options);
    }

    public addLocalClient(client: LocalClient) {
        if (client.host !== this) {
            return;
        }

        this.send({
            event: HOST_EVENT.LOCAL_JOIN,
            data: {
                id: client.id
            }
        });

        this.localClients.push(client);
    }

    public getLocalClient(id: string): LocalClient | null {
        return this.localClients.find(client => client.id === id) || null;
    }

    public getNewLocalClientID(): string {
        let count = this.localClients.length + 1;
        let id: string;
        do {
            id = `local-${this.id}-${count}`;
            count++;
        } while (this.localClients.find(client => client.id === id));
        return id;
    }

    public lock(reason?: string) {
        this.locked = true;
        this.send({
            event: HOST_EVENT.LOCK,
            data: {
                reason
            }
        });
    }

    public unlock() {
        this.locked = false;
        this.send({
            event: HOST_EVENT.UNLOCK,
        });
    }

    public close(reason?: string) {
        this.socket.close(CLOSE_CODE.CLOSED, reason);
    }

    public ping(id?: string): Promise<number> {
        const now = (new Date()).getTime();

        if (id) {
            return this.pingClient(id, now);
        } else {
            return this.pingServer(now);
        }

    }

    /**
     * Final stage of connection handshake - sends create message to LipwigCore server
     */
    private connected(): void {
        const message: HostEvents.Create = {
            event: HOST_EVENT.CREATE,
            data: {
                config: this.config,
            },
        };
        this.socket.send(message);
    }

    public handle(message: ServerHostEvents.Event): void {
        Logger.debug(`[${this.name}] Received '${message.event}' event`);
        let eventName: string = message.event;
        let sender: string | null = null;
        let user: User | undefined;
        const args: unknown[] = [];
        switch (message.event) {
            case SERVER_HOST_EVENT.CREATED:
                Logger.debug(`[${this.name}] Created room ${message.data.code}`);
                this.room = message.data.code;
                this.id = message.data.id;
                args.push(message.data.code);

                this.socket.setData(this.room, message.data.id);
                break;
            case SERVER_HOST_EVENT.JOINED:
                Logger.debug(`[${this.name}] ${message.data.id} joined`);
                const data = message.data;
                const local = data.id.startsWith('local-');
                user = new User(data.id, this, data.data, local);
                this.users.push(user);
                args.push(data.data); 

                if (local) {
                    const client = this.localClients.find(client => data.id === client.id);
                    if (!client) {
                        // TODO: Handle
                        return;
                    }
                    user.client = client;
                }
                break;
            case SERVER_HOST_EVENT.JOIN_REQUEST:
                const request = new JoinRequest(this, message.data.id);
                args.push(request);
                args.push(message.data.data || {});
                break;
            case SERVER_HOST_EVENT.MESSAGE:
                Logger.debug(`[${this.name}] Received '${message.data.event}' message`);
                args.push(...message.data.args);
                eventName = message.data.event;
                sender = message.data?.sender || '';

                this.emit(message.event, eventName, ...args, this); // Emit 'lw-message' event on all messages
                break;
            case SERVER_HOST_EVENT.POLL_RESPONSE:
                const pollId = message.data.id;
                const clientId = message.data.id;
                const response = message.data.response;
                Logger.debug(`[${this.name}] Received response to poll ${pollId} from ${clientId}`);

                const poll = this.polls.find(poll => poll.id === pollId);
                if (!poll) {
                    // TODO: Handle
                    return;
                }

                user = this.users.find(user => user.id === clientId);
                poll.emit('response', user, response);
                args.push(poll);
                args.push(response);
                break;
            case SERVER_HOST_EVENT.CLIENT_RECONNECTED:
                Logger.debug(`[${this.name}] ${message.data.id} reconnected`);
                const reconnected = this.users.find(
                    (user) => message.data.id === user.id
                );
                if (!reconnected) {
                    // TODO: Handle this. Malformed error?
                }
                args.push(reconnected);
                break;
            case SERVER_HOST_EVENT.RECONNECTED:
                Logger.debug(`[${this.name}] Reconnected`);
                this.room = message.data.room;
                this.id = message.data.id;
                this.socket.setData(this.room, this.id);

                message.data.users = message.data.users || [];
                message.data.local = message.data.local || [];

                for (const existing of message.data.users) {
                    if (this.users.find((user) => existing === user.id)) {
                        // Don't need to recreate if non-reload reconnection
                        continue;
                    }
                    const user: User = new User(existing, this);
                    this.users.push(user);
                }

                for (const existing of message.data.local) {
                    if (this.users.find((user) => existing === user.id)) {
                        // Don't need to recreate if non-reload reconnection
                        continue;
                    }
                    // TODO: finish this
                    //this.c
                }

                args.push(this.users);
                break;
            case SERVER_HOST_EVENT.CLIENT_DISCONNECTED:
                Logger.debug(`[${this.name}] ${message.data.id} disconnected`);
                const disconnected = this.users.find(
                    (user) => user.id === message.data.id
                );
                args.push(disconnected);
                break;
            case SERVER_HOST_EVENT.LEFT:
                if (message.data.reason) {
                    Logger.debug(`[${this.name}] ${message.data.id} left - ${message.data.reason}`);
                } else {
                    Logger.debug(`[${this.name}] ${message.data.id} left`);
                }
                const id = message.data.id;
                const index = this.users.findIndex(user => id === user.id);
                if (index === -1) {
                    // TODO: user not found
                } 
                user = this.users[index];
                this.users.splice(index, 1);
                args.push(message.data.reason);
                break;
            case SERVER_HOST_EVENT.PING_HOST:
                this.send({
                    event: HOST_EVENT.PONG_HOST,
                    data: message.data
                });
                user = this.users.find(value => value.id === message.data.id);
                break;
            case SERVER_HOST_EVENT.PONG_SERVER:
            case SERVER_HOST_EVENT.PONG_CLIENT:
                const now = (new Date()).getTime();
                const ping = now - message.data.time;
                args.push(ping);

                if (message.event === SERVER_HOST_EVENT.PONG_CLIENT) {
                    user = this.users.find(user => user.id === message.data.id);
                    this.emit(`${SERVER_HOST_EVENT.PONG_CLIENT}-${message.data.id}`, ping);
                }
                break;
        }

        if (!user) {
            user = this.users.find((user) => sender === user.id);
        }

        if (user) {
            args.push(message);
            user.emit(eventName, ...args);
            args.unshift(user);
        }

        this.emit(eventName, ...args, this);
    }

    private pingServer(now: number): Promise<number> {
        const promise = new Promise<number>(resolve => {
            this.once(SERVER_HOST_EVENT.PONG_SERVER, ping => {
                resolve(ping);
            });
        });

        this.send({
            event: HOST_EVENT.PING_SERVER,
            data: {
                time: now
            }
        });
        return promise;
    }

    private pingClient(id: string, now: number): Promise<number> {
        const promise = new Promise<number>(resolve => {
            const event = `${SERVER_HOST_EVENT.PONG_CLIENT}-${id}`;
            this.once(event, ping => {
                resolve(ping);
            });
        });

        if (id.startsWith('local-')) {
            const user = this.users.find(user => user.id === id);
            user?.client?.handle({
                event: SERVER_CLIENT_EVENT.PING_CLIENT,
                data: {
                    time: now
                }
            });
        } else {
            this.send({
                event: HOST_EVENT.PING_CLIENT,
                data: {
                    time: now,
                    id
                }
            });
        }

        return promise;
    }

    public getGroup(name: string): Group {
        let group = this.groups.find(group => group.name === name);
        if (!group) {
            group = new Group(this, name);
            this.groups.push(group);
        }

        return group;
    }

    public getGroups(): Group[] {
        return this.groups.filter(group => group.size());
    }

    public assign(user: User, name: string, inform: boolean = false): Group {
        const group = this.getGroup(name);
        group.add(user, inform);
        return group;
    }

    public unassign(user: User, name: string, inform: boolean = false): Group {
        const group = this.getGroup(name);
        group.remove(user, inform);
        return group;
    }
}
