/**
 * @author: WillHayCode
 */
import {
    HOST_EVENT,
    SERVER_HOST_EVENT,
    SERVER_CLIENT_EVENT,
    WEBSOCKET_CLOSE_CODE,
    HostEvents,
    ServerHostEvents,
    RoomConfig,
    UserOptions,
} from '@whc/lipwig/model';
import { User } from './User';
import { LocalClient } from './LocalClient';
import { EventManager } from './EventManager';
import { Socket } from './Socket';

type GroupMap = {
    [index: string]: User[];
};

export class Host extends EventManager {
    private users: User[] = [];
    private groups: GroupMap;

    private socket: Socket;
    public room = '';
    public id = '';

    /**
     * Create a new Lipwig room
     * @param url       Websocket url of LipwigCore server
     * @param options   Options with which to create room
     */
    constructor(url: string, public config: RoomConfig = {}) {
        super();

        this.socket = new Socket(url);
        this.addSocketListeners();

        this.groups = {};
    }

    // TODO: Move to common file
    private addSocketListeners() {
        this.socket.on('connected', () => {
            this.connected();
        });

        this.socket.on('error', () => {
            // TODO
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
            //this.addSocketListeners();
        });
    }

    /**
     * @return map of all users in room
     */
    public getUsers(): User[] {
        return this.users; // TODO: This is returning a reference to the original object
    }

    public getUser(id: string) {
        return this.users.find(user => id === user.id);
    }

    public assign(user: User, name: string): void {
        let group: User[] = this.groups[name];
        if (group === undefined) {
            this.groups[name] = [];
            group = this.groups[name];
        }

        if (group.indexOf(user) !== -1) {
            // Already in group
            return;
        }

        group.push(user);
        user.send('assigned', name);
    }

    public unassign(user: User, name: string): void {
        const group: User[] = this.groups[name];
        if (group === undefined) {
            return;
        }

        const position: number = group.indexOf(user);
        if (position === -1) {
            // Not in group
            return;
        }

        this.groups[name] = group.splice(position, 1);
        user.send('unassigned', name);
    }

    public getGroup(name: string): User[] {
        const group: User[] = this.groups[name];
        if (group === undefined) {
            return [];
        }

        return group;
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

    public sendTo(event: string, users: User | User[], ...args: unknown[]) {
        if (!Array.isArray(users)) {
            users = [users];
        }

        const remoteRecipients = users
            .filter((user) => !user.id.startsWith('local-'))
            .map((user) => user.id);
        const localRecipients = users.filter((user) =>
            user.id.startsWith('local-')
        );
        this.send({
            event: HOST_EVENT.MESSAGE,
            data: {
                event,
                args,
                recipients: remoteRecipients,
            },
        });

        for (const user of localRecipients) {
            user.send(event, ...args);
        }
    }

    public send(message: HostEvents.Event) {
        if (message.event === HOST_EVENT.KICK) {
            const id = message.data.id;
            const index = this.users.findIndex(user => id === user.id);
            if (index === -1) {
                // TODO: user not found
            } 
            this.users.splice(index, 1);
        }
        this.socket.send(message);
    }

    public close(reason?: string) {
        this.socket.close(WEBSOCKET_CLOSE_CODE.CLOSED, reason);
    }

    public createLocalClient(
        options: UserOptions = {},
        localID?: string
    ): LocalClient {
        if (!localID) {
            let localCount = 1;
            do {
                localID = `local-${this.id}-${localCount}`;
                localCount++;
            } while (this.users.find((user) => user.id === localID));
        }

        const localUser = new User(localID, this, options.data, true);
        console.log(localUser);
        // TODO: Changing this to socket will need to be re-evaluated when reconnection comes into play
        const localClient = new LocalClient(
            this,
            localUser,
            this.room,
            options
        );

        localUser.client = localClient;
        localClient.id = localID;

        this.users.push(localUser);

        // Set timeout to allow moment for listeners to be set on both ends
        // Hopefully this doesn't introduce a race condition
        // TODO: Looks like this introduced a race condition.
        //       Not a massive surprise I guess.
        // TODO: Add callback as parameter
        setTimeout(() => {
            this.emit(SERVER_HOST_EVENT.JOINED, localUser, options);
            localClient.emit(SERVER_CLIENT_EVENT.JOINED, localID);
        }, 10);

        return localClient;
    }

    public handle(message: ServerHostEvents.Event): void {
        let eventName: string = message.event;
        let sender: string | null = null;
        let user: User | undefined;
        const args: unknown[] = [];
        switch (message.event) {
            case SERVER_HOST_EVENT.CREATED:
                this.room = message.data.code;
                this.id = message.data.id;
                args.push(message.data.code);

                this.socket.setData(this.room, message.data.id);
                break;
            case SERVER_HOST_EVENT.JOINED:
                const data = message.data;
                user = new User(data.id, this, data.options?.data);
                this.users.push(user);
                args.push(user);
                args.push(data.options?.data); //TODO: Potentially just send the data in the end, trim the rest on the server. Currently only 'reconnect' is used.
                this.emit(eventName, ...args, this);
                return;
            case SERVER_HOST_EVENT.MESSAGE:
                args.push(...message.data.args);
                eventName = message.data.event;
                sender = message.data?.sender || '';

                this.emit(message.event, eventName, ...args, this); // Emit 'lw-message' event on all messages
                break;
            case SERVER_HOST_EVENT.CLIENT_RECONNECTED:
                const reconnected = this.users.find(
                    (user) => message.data.id === user.id
                );
                if (!reconnected) {
                    // TODO: Handle this. Malformed error?
                }
                args.push(reconnected);
                break;
            case SERVER_HOST_EVENT.RECONNECTED:
                this.room = message.data.room;
                this.id = message.data.id;
                this.socket.setData(this.room, this.id);
                if (!message.data.users || !message.data.local) {
                    // TODO: This shouldn't happen, but should be handled
                    break;
                }

                for (const existing of message.data.users) {
                    if (this.users.find((user) => existing === user.id)) {
                        // Don't need to recreate if non-reload reconnection
                        continue;
                    }
                    const user: User = new User(existing, this);
                    this.users.push(user);
                }

                for (let i = 0; i < message.data.local; i++) {
                    const localID = `local-${this.id}-${i}`;
                    if (this.users.find((user) => localID === user.id)) {
                        // Don't need to recreate if non-reload reconnection
                        continue;
                    }
                    // TODO: finish this
                    //this.c
                }

                args.push(this.users);
                break;
            case SERVER_HOST_EVENT.ERROR:
                break;
            case SERVER_HOST_EVENT.CLIENT_DISCONNECTED:
                const disconnected = this.users.find(
                    (user) => user.id === message.data.id
                );
                args.push(disconnected);
                break;
            case SERVER_HOST_EVENT.LEFT:
                const id = message.data.id;
                const index = this.users.findIndex(user => id === user.id);
                if (index === -1) {
                    // TODO: user not found
                } 
                user = this.users[index];
                this.users.splice(index, 1);
                args.push(message.data.reason);
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

        console.log(eventName, ...args);
        this.emit(eventName, ...args, this);
    }

    /**
     * Final stage of connection handshake - sends create message to LipwigCore server
     */
    protected connected(): void {
        const message: HostEvents.Create = {
            event: HOST_EVENT.CREATE,
            data: {
                config: this.config,
            },
        };
        this.socket.send(message);
    }
}
