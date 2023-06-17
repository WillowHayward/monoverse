import { Move } from "@whc/rock-off/common"
import { Contestant } from "./contestant"
import { User } from "@whc/lipwig/js";

export class Player extends Contestant {
    constructor(private user: User) {
        super(user.data['name'], false);
    }

    public getMove(): Promise<Move> {
        const poll = this.user.poll('getMove');
        return new Promise(resolve => {
            poll.on('response', (user: User, response: Move) => {
                resolve(response);
            });
        });
    }
}
