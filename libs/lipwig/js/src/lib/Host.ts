/**
 * @author: WillHayCode
 */
import {
    RoomConfig,
    UserOptions,
    CloseEvent,
    CreateEvent,
    JoinedEvent,
    ServerEvent,
    CLIENT_EVENT,
    SERVER_EVENT,
    ClientEvent,
} from '@whc/lipwig/types';
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
    public room: string = '';
    public id: string = '';

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

        this.socket.on('message', (message: ServerEvent) => {
            this.handle(message);
        });

        this.socket.on('reconnected', (socket: Socket) => {
            this.socket = socket;
            this.addSocketListeners();
        });
    }


    /**
     * @return map of all users in room
     */
    public getUsers(): User[] {
        return this.users; // TODO: This is returning a reference to the original object
    }

    public close(reason = ''): void {
        const message: CloseEvent = {
            event: CLIENT_EVENT.CLOSE,
            data: {
                reason,
            },
        };

        this.socket.send(message);
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

    public sendToAllExcept(event: string, except: User | User[], ...args: unknown[]) {
        const recipients = this.users.filter(user => user !== except);

        this.sendTo(event, recipients, ...args);
    }

    public sendTo(event: string, users: User | User[], ...args: unknown[]) {
        if (!Array.isArray(users)) {
            users = [users];
        }

        const remoteRecipients = users.filter(user => !user.id.startsWith('local-')).map(user => user.id);
        const localRecipients = users.filter(user => user.id.startsWith('local-'));
        this.socket.send({
            event: CLIENT_EVENT.MESSAGE,
            data: {
                event,
                args,
                recipients: remoteRecipients
            }
        });

        for (const user of localRecipients) {
            user.send(event, ...args);
        }
    }

    public send(message: ClientEvent) {
        this.socket.send(message);
    }

    public createLocalClient(
        options: UserOptions = {},
        callback: (id: string) => void = () => null
    ): LocalClient {
        let localCount = 1;
        let localID: string;
        do {
            localID = `local-${this.id}-${localCount}`;
            localCount++;
        } while (this.users.find(user => user.id === localID));

        const localUser = new User(localID, this, true);
        // TODO: Changing this to socket will need to be re-evaluated when reconnection comes into play
        const localClient = new LocalClient(this, localUser, this.room, options);

        localUser.client = localClient;
        localClient.id = localID;

        this.users.push(localUser);

        localClient.on(SERVER_EVENT.JOINED, (id: string) => {
            callback(id);
        }); 

        // Set timeout to allow moment for listeners to be set on both ends
        // Hopefully this doesn't introduce a race condition
        // TODO: Looks like this introduced a race condition.
        //       Not a massive surprise I guess.
        // TODO: Add callback as parameter
        setTimeout(() => {
            this.emit(SERVER_EVENT.JOINED, localUser, options);
            localClient.emit(SERVER_EVENT.JOINED, localID);
        }, 10);

        return localClient;
    }

    public handle(message: ServerEvent): void {
        let eventName: string = message.event; 
        let sender: string | null = null;
        const args: unknown[] = [];
        switch (message.event) {
            case SERVER_EVENT.CREATED:
                this.room = message.data.code;
                this.id = message.data.id;
                args.push(message.data.code);

                this.socket.setData(this.room, message.data.id);
                break;
            case SERVER_EVENT.JOINED:
                const user: User = new User(message.data.id, this);
                this.users.push(user);
                args.push(user);
                args.push(message.data.options);
                this.emit(eventName, ...args, this);
                return;
            case SERVER_EVENT.MESSAGE:
                args.push(...message.data.args);
                eventName = message.data.event;
                sender = message.data?.sender || '';

                this.emit(message.event, eventName, ...args, this); // Emit 'lw-message' event on all messages
                break;
            case SERVER_EVENT.RECONNECTED:
                console.log('Host received RECONNECTED event', message.data);
                // TODO: Does this need to be two events? One for the host reconnecting, one for a client?
                // CONT: "users" field suggests two events
                if (this.id.length) {
                    // Client reconnecting
                    const user = this.users.find(user => message.data.id === user.id);
                    if (!user) {
                        // TODO: Handle this. Malformed error?
                    }
                    args.push(user);
                } else {
                    // Host reconnecting
                    this.room = message.data.room;
                    this.id = message.data.id;
                    this.socket.setData(this.room, this.id);
                    if (!message.data.users) {
                        break;
                    }
                    for (const existing of message.data.users) {
                        const user: User = new User(existing, this);
                        this.users.push(user);
                    }
                }
                break;
            case SERVER_EVENT.ERROR:
                break;
            case SERVER_EVENT.KICKED:
                break;
        }

        const user = this.users.find(user => sender === user.id);
        if (user) {
            args.push(message);
            user.emit(eventName, ...args);
            args.splice(0, 0, user);
        }

        this.emit(eventName, ...args, this);
    }

    /**
     * Final stage of connection handshake - sends create message to LipwigCore server
     */
    protected connected(): void {
        const message: CreateEvent = {
            event: CLIENT_EVENT.CREATE,
            data: {
                config: this.config,
            },
        };
        this.socket.send(message);
    }
}
