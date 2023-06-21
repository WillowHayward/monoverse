import { v4 } from "uuid";
import { Host } from "./Host";
import { HOST_EVENT } from "@whc/lipwig/model";
import { EventManager } from "../EventManager";
import { User } from "./User";

export class Poll extends EventManager {
    public id: string;
    constructor(private host: Host, users: User[], public query: string, id?: string) { 
        super();
        this.id = id || v4();
        const recipients = users.map(user => user.id);
        this.host.send({
            event: HOST_EVENT.POLL,
            data: {
                id: this.id,
                recipients,
                query
            }
        });
    }
}
