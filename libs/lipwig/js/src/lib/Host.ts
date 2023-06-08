/**
 * @author: WillHayCode
 */
import { SocketUser } from './SocketUser';
import {
    RoomConfig,
    UserOptions,
    CloseEvent,
    CLIENT_EVENT,
    LipwigMessageEvent,
    CreateEvent,
    CreatedEvent,
    JoinedEvent,
    ServerEvent,
    SERVER_EVENT,
} from '@whc/lipwig/types';
import { User } from './User';
import { LocalClient } from './LocalClient';

type UserMap = {
    [index: string]: User;
};

type GroupMap = {
    [index: string]: User[];
};

type Filter = {
    whitelist: string[];
    blacklist: string[];
};

export class Host extends SocketUser {
    private users: UserMap;
    private groups: GroupMap;

    /**
     * Create a new Lipwig room
     * @param url       Websocket url of LipwigCore server
     * @param options   Options with which to create room
     */
    constructor(url: string, public config: RoomConfig = {}) {
        super(url);
        this.reserved.once('created', this.created, { object: this });
        this.reserved.on('joined', this.joined, { object: this });

        this.users = {};
        this.groups = {};
    }

    /**
     * @return map of all users in room
     */
    public getUsers(): UserMap {
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

    public send(message: string, filter: Filter, ...args: unknown[]): void {
        // TODO: Move this to server logic
        let users: User[] = [];
        if (filter.whitelist === undefined) {
            filter.whitelist = [];
        }

        users = this.filter(filter.whitelist, true);

        if (filter.blacklist === undefined) {
            filter.blacklist = [];
        }

        const blacklist: User[] = this.filter(filter.blacklist, false);

        users.forEach((user: User): void => {
            if (blacklist.indexOf(user) > -1) {
                return;
            }
            user.send(message, ...args);
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
        } while (this.users[localID] !== undefined);

        const localUser = new User(localID, this, true);
        const localClient = new LocalClient(this, localUser, options);

        localUser.client = localClient;
        localClient.id = localID;

        this.users[localID] = localUser;

        localClient.on('joined', callback, { object: localClient }); // Context?
        /*localClient.emit('joined', localID);
      this.emit('joined', localUser, data);*/

        // Set timeout to allow moment for listeners to be set on both ends
        // Hopefully this doesn't introduce a race condition
        // TODO: Looks like this introduced a race condition.
        //       Not a massive surprise I guess.
        // TODO: Add callback as parameter
        setTimeout(() => {
            this.emit('joined', localUser, options);
            localClient.emit('joired', localID);
        }, 10);

        return localClient;
    }

    protected handle(event: MessageEvent): void {
        const message: ServerEvent = JSON.parse(event.data);

        let eventName: string = message.event; // TODO: For LipwigMessageEvent, change to data event
        let sender: string | null = null;
        const args: unknown[] = [];
        let emit = true;
        switch (message.event) {
            case SERVER_EVENT.CREATED:
                const created = message as CreatedEvent;
                args.push(created.data.code);
                break;
            case SERVER_EVENT.JOINED:
                const joined = message as JoinedEvent;
                args.push(joined.data.id);
                args.push(joined.data.options);
                emit = false;
                break;
            case SERVER_EVENT.MESSAGE:
                const msg = message as LipwigMessageEvent;
                args.push(...msg.data.args);
                eventName = msg.data.event;
                sender = msg.data.sender;

                this.emit(message.event, eventName, ...args, this); // Emit 'message' event on all messages
                break;
            case SERVER_EVENT.RECONNECTED:
                break;
            case SERVER_EVENT.ERROR:
                break;
            case SERVER_EVENT.KICKED:
                break;
        }

        this.reserved.emit(message.event, ...args);

        if (sender && sender in this.users) {
            const user: User = this.users[sender];
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
        this.users[userID] = user;
        this.emit('joined', user, options, message);
    }

    private filter(groups: string[], whitelist: boolean): User[] {
        let filtered: User[] = [];

        if (groups.length === 0 && whitelist) {
            const users: UserMap = this.getUsers();
            const userIDs: string[] = Object.keys(users);
            userIDs.forEach((id: string): void => {
                filtered.push(users[id]);
            });

            return filtered;
        }

        groups.forEach((name: string): void => {
            filtered = filtered.concat(this.getGroup(name));
        });

        filtered = filtered.filter(
            (user: User, index: number, users: User[]): boolean => {
                return users.indexOf(user) === index;
            }
        );

        return filtered;
    }
}
