/**
 * @author: WillHayCode
 */
import { SocketUser } from './SocketUser';
import {
    RoomConfig,
    UserOptions,
    CloseEvent,
    CreateEvent,
    JoinedEvent,
    ServerEvent,
    CLIENT_EVENT,
    SERVER_EVENT,
} from '@whc/lipwig/types';
import { User } from './User';
import { LocalClient } from './LocalClient';

type GroupMap = {
    [index: string]: User[];
};

export class Host extends SocketUser {
    private users: User[] = [];
    private groups: GroupMap;

    /**
     * Create a new Lipwig room
     * @param url       Websocket url of LipwigCore server
     * @param options   Options with which to create room
     */
    constructor(url: string, public config: RoomConfig = {}) {
        super(url);
        this.reserved.once(SERVER_EVENT.CREATED, (id: string) => {
            this.created(id);
        });
        this.reserved.on(SERVER_EVENT.JOINED, (userID: string, options: UserOptions, message: JoinedEvent) => {
            this.joined(userID, options, message);
        });

        this.groups = {};
        console.log(this);
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

        this.sendMessage(message);
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
        const recipient = this.users.filter(user => user !== except);

        this.sendTo(event, recipient, ...args);
    }

    public sendTo(event: string, users: User | User[], ...args: unknown[]) {
        if (!Array.isArray(users)) {
            users = [users];
        }

        const recipient = users.map(user => user.id);
        console.log(recipient);
        this.sendMessage({
            event: CLIENT_EVENT.MESSAGE,
            data: {
                event,
                args,
                sender: this.id, // TODO: this.room?
                recipient
            }
        });
    }

    public createLocalClient(
        options: UserOptions = {},
        callback: (id: string) => void = () => null
    ): LocalClient {
        let localCount = 1;
        let localID: string;
        do {
            localID = this.id + '-local' + localCount;
            localCount++;
        } while (this.users.find(user => user.id === localID));

        const localUser = new User(localID, this, true);
        const localClient = new LocalClient(this, localUser, options);

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

    protected handle(event: MessageEvent): void {
        const message: ServerEvent = JSON.parse(event.data);

        let eventName: string = message.event; 
        let sender: string | null = null;
        const args: unknown[] = [];
        let emit = true;
        switch (message.event) {
            case SERVER_EVENT.CREATED:
                this.room = message.data.code;
                args.push(message.data.code);
                break;
            case SERVER_EVENT.JOINED:
                args.push(message.data.id);
                args.push(message.data.options);
                emit = false;
                break;
            case SERVER_EVENT.MESSAGE:
                args.push(...message.data.args);
                eventName = message.data.event;
                sender = message.data.sender;

                this.emit(message.event, eventName, ...args, this); // Emit 'lw-message' event on all messages
                break;
            case SERVER_EVENT.RECONNECTED:
                break;
            case SERVER_EVENT.ERROR:
                break;
            case SERVER_EVENT.KICKED:
                break;
        }

        this.reserved.emit(message.event, ...args);

        const user = this.users.find(user => sender === user.id);
        if (user) {
            args.push(message);
            user.emit(eventName, ...args);
            args.splice(0, 0, user);
            //args.unshift(user);
        }

        if (emit) {
            this.emit(eventName, ...args, this);
        }
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
        this.sendMessage(message);
    }

    private created(id: string): void {
        this.setID(id); // Also deleted reserved event
    }

    private joined(
        userID: string,
        options: UserOptions,
        message: JoinedEvent
    ): void {
        const user: User = new User(userID, this);
        this.users.push(user);
        console.log(this.users);
        this.emit('joined', user, options, message);
    }
}
