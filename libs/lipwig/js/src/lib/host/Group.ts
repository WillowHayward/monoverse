import { EventManager } from "../EventManager";
import { Host } from "./Host";
import { Poll } from "./Poll";
import { User } from "./User";

export class Group extends EventManager {
    private users: User[] = [];

    constructor(private host: Host, public name: string) {
        super();
    }

    public add(user: User, inform = false) {
        if (this.users.includes(user)) {
            return;
        }
        this.users.push(user);

        if (inform) {
            user.send('assigned', this.name);
        }
        console.log(this.users);
    }

    public remove(user: User, inform = false) {
        const index = this.users.indexOf(user);
        if (index === -1) {
            return;
        }
        this.users.splice(index, 1);

        if (inform) {
            user.send('unassigned', this.name);
        }
    }

    public includes(user: User): boolean {
        return this.users.indexOf(user) !== -1;
    }

    public clear(inform = false) {
        for (const user of this.users) {
            this.remove(user, inform);
        }
    }

    public size(): number {
        return this.users.length;
    }

    public getUsers(): User[] {
        return this.users.slice();
    }

    public send(event: string, ...args: any[]) {
        this.host.sendTo(event, this.users, ...args);
    }

    public poll(query: string, id?: string): Poll {
        return this.host.poll(this.users, query, id);
    }

    public kick(reason?: string) {
        for (const user of this.users) {
            user.kick(reason);
        }
    }
}
