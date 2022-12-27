/**
 * @author: WillHayCode
 */
import { SocketUser } from './SocketUser';
import { Message, DataMap } from './Types';
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
    private options: DataMap;

    /**
     * Create a new Lipwig room
     * @param url       Websocket url of LipwigCore server
     * @param options   Options with which to create room
     */
    constructor(url: string, options: DataMap = {}) {
      super(url);
      this.reserved.once('created', this.created, { object: this });
      this.reserved.on('joined', this.joined, { object: this });

      this.users = {};
      this.groups = {};
      this.options = options;
    }

    /**
     * @return map of all users in room
     */
    public getUsers(): UserMap {
      return this.users; // TODO: This is returning a reference to the original object
    }

    public close(reason = ''): void {
      const message: Message = {
        event: 'close',
        data: {
            args: [reason],
            recipient: [],
            sender: this.id
        }
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

    public createLocalClient(data: DataMap = {}, callback: (id: string) => void = 
    ()=> null): LocalClient {
      let localCount = 1;
      let localID: string;
      do {
        localID = this.id + '-local' + localCount;
        localCount++;
      } while (this.users[localID] !== undefined);

      const localUser = new User(localID, this, true);
      const localClient = new LocalClient(this, localUser, data);

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
        this.emit('joined', localUser, data);
        localClient.emit('joined', localID);
      }, 10);

      return localClient;
    }

    protected handle(event: MessageEvent): void {
      const message: Message = JSON.parse(event.data);
      const args: unknown[] = message.data.args.concat(message);

      this.reserved.emit(message.event, ...args);

      if (message.data.sender in this.users) {
        const user: User = this.users[message.data.sender];
        args.push(message);
        user.emit(message.event, ...args);
        args.splice(0, 0, user);
      }

      if (message.event !== 'joined') {
        this.emit(message.event, ...args);
      }
    }

    /**
     * Final stage of connection handshake - sends create message to LipwigCore server
     */
    protected connected(): void {
      const message: Message = {
        event: 'create',
        data: {
            args: [this.options],
            sender: '',
            recipient: []
        }
      };
      this.sendMessage(message);
    }

    private created(id: string): void {
      this.setID(id); // Also deleted reserved event
    }

    private joined(userID: string, data: DataMap, message: Message): void {
      const user: User = new User(userID, this);
      this.users[userID] = user;
      this.emit('joined', user, data, message);
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

      filtered = filtered.filter((user: User, index: number, users: User[]): boolean => {
        return users.indexOf(user) === index;
      });

      return filtered;
    }
}
