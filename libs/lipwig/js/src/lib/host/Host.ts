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
        let args: unknown[] = [];
        switch (message.event) {
            case SERVER_HOST_EVENT.CREATED:
                args = this.handleCreated(message.data.id, message.data.code);
                break;
            case SERVER_HOST_EVENT.JOINED:
                [user, args] = this.handleJoined(message.data.id, message.data.data);
                break;
            case SERVER_HOST_EVENT.JOIN_REQUEST:
                args = this.handleJoinRequest(message.data.id, message.data.data);
                break;
            case SERVER_HOST_EVENT.MESSAGE:
                [eventName, sender, args] = this.handleMessage(message.data.event, message.data.args, message.data.sender);
                break;
            case SERVER_HOST_EVENT.POLL_RESPONSE:
                [user, args] = this.handlePollResponse(message.data.id, message.data.client, message.data.response);
                break;
            case SERVER_HOST_EVENT.CLIENT_RECONNECTED:
                args = this.handleClientReconected(message.data.id);
                break;
            case SERVER_HOST_EVENT.RECONNECTED:
                args = this.handleReconnected(message.data.id, message.data.room, message.data.users, message.data.local);
                break;
            case SERVER_HOST_EVENT.CLIENT_DISCONNECTED:
                args = this.handleClientDisconnected(message.data.id);
                break;
            case SERVER_HOST_EVENT.LEFT:
                [user, args] = this.handleLeft(message.data.id, message.data.reason);
                break;
            case SERVER_HOST_EVENT.PING_HOST:
                user = this.handlePingHost(message.data.id, message.data.time);
                break;
            case SERVER_HOST_EVENT.PONG_SERVER:
                args = this.handlePongServer(message.data.time);
                break;
            case SERVER_HOST_EVENT.PONG_CLIENT:
                [user, args] = this.handlePongClient(message.data.id, message.data.time);
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

    private handleCreated(id: string, room: string): [string] {
        Logger.debug(`[${this.name}] Created room ${room}`);
        this.room = room;
        this.id = id;

        this.socket.setData(this.room, id);
        return [room];
    }

    private handleJoined(id: string, data: Record<string, unknown> = {}): [User, [User, Record<string, unknown>]] {
        Logger.debug(`[${this.name}] ${id} joined`);
        const local = id.startsWith('local-');
        const user = new User(id, this, data, local);
        this.users.push(user);

        if (local) {
            const client = this.localClients.find(client => id === client.id);
            if (!client) {
                throw new Error('Something went wrong'); //TODO
            }
            user.client = client;
        }
        return [user, [user, data]];
    }

    private handleJoinRequest(id: string, data: Record<string, unknown> = {}): [JoinRequest, Record<string, unknown>] {
        const request = new JoinRequest(this, id);
        return [request, data];
    }

    private handleMessage(event: string, args: unknown[], sender = ''): [string, string, unknown[]] {
        Logger.debug(`[${this.name}] Received '${event}' message`);

        this.emit(SERVER_HOST_EVENT.MESSAGE, event, ...args, this); // Emit 'lw-message' event on all messages
        return [event, sender, args];
    }

    private handlePollResponse(id: string, client: string, response: unknown): [User, [Poll, unknown]] {
        Logger.debug(`[${this.name}] Received response to poll ${id} from ${client}`);

        const poll = this.polls.find(poll => poll.id === id);
        if (!poll) {
            throw new Error(`Could not find poll ${id}`);
        }

        const user = this.users.find(user => user.id === client);

        if (!user) {
            throw new Error(`Could not find user ${client}`);
        }

        poll.emit('response', user, response);
        return [user, [poll, response]];
    }

    private handleClientReconected(id: string): [User] {
        Logger.debug(`[${this.name}] ${id} reconnected`);
        const reconnected = this.users.find(
            (user) => id === user.id
        );
        if (!reconnected) {
            throw new Error(`Could not find user ${id}`);
        }
        return [reconnected];
    }

    private handleReconnected(id: string, room: string, users: string[] = [], local: string[] = []): [User[]] {
        Logger.debug(`[${this.name}] Reconnected`);
        this.room = room;
        this.id = id;
        this.socket.setData(this.room, this.id);

        for (const existing of users) {
            if (this.users.find((user) => existing === user.id)) {
                // Don't need to recreate if non-reload reconnection
                continue;
            }
            const user: User = new User(existing, this);
            this.users.push(user);
        }

        for (const existing of local) {
            if (this.users.find((user) => existing === user.id)) {
                // Don't need to recreate if non-reload reconnection
                continue;
            }
            // TODO: finish this
            //this.c
        }

        return [this.users];
    }

    private handleClientDisconnected(id: string): [User] {
        Logger.debug(`[${this.name}] ${id} disconnected`);
        const disconnected = this.users.find(
            (user) => user.id === id
        );

        if (!disconnected) {
            throw new Error(`Could not find user ${id}`);
        }

        return [disconnected];
    }

    private handleLeft(id: string, reason?: string): [User, [string | undefined]] {
        if (reason) {
            Logger.debug(`[${this.name}] ${id} left - ${reason}`);
        } else {
            Logger.debug(`[${this.name}] ${id} left`);
        }
        const index = this.users.findIndex(user => id === user.id);
        if (index === -1) {
            throw new Error(`Could not find user ${id}`);
        }

        const user = this.users[index];
        this.users.splice(index, 1);
        return [user, [reason]];
    }

    private handlePingHost(id: string, time: number): User {
        this.send({
            event: HOST_EVENT.PONG_HOST,
            data: { id, time }
        });
        const user = this.users.find(value => value.id === id);

        if (!user) {
            throw new Error(`Could not find user ${id}`);
        }

        return user;
    }

    private handlePongServer(then: number): [number] {
        const ping = this.handlePong(then);
        return [ping];
    }

    private handlePongClient(id: string, then: number): [User, [number]] {
        const ping = this.handlePong(then);
        const user = this.users.find(user => user.id === id);

        if (!user) {
            throw new Error(`Could not find user ${id}`);
        }

        this.emit(`${SERVER_HOST_EVENT.PONG_CLIENT}-${id}`, ping);

        return [user, [ping]];
    }

    private handlePong(then: number): number {
        const now = (new Date()).getTime();
        const ping = now - then;
        return ping;
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

    public assign(user: User, name: string, inform = false): Group {
        const group = this.getGroup(name);
        group.add(user, inform);
        return group;
    }

    public unassign(user: User, name: string, inform = false): Group {
        const group = this.getGroup(name);
        group.remove(user, inform);
        return group;
    }
}
