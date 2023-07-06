import { Move } from "@whc/rock-off/common"
import { Contestant } from "./contestant"
import { User } from "@lipwig/js";

export class Player extends Contestant {
    constructor(private user: User) {
        super(user.data['name'], false);
    }

    public getMove(): Promise<Move> {
        const poll = this.user.poll('getMove');
        this.currentMove = new Promise(resolve => {
            poll.on('response', (user: User, response: Move) => {
                resolve(response);
            });
        });

        return this.currentMove;
    }
}
