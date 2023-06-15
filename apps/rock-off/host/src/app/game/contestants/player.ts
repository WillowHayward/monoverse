import { Move } from "@whc/rock-off/common"
import { Contestant } from "./contestant"
import { User } from "@whc/lipwig/js";

export class Player extends Contestant {
    constructor(private user: User) {
        super(user.data['name'], false);
    }

    public getMove(): Promise<Move> {
        const moves = Object.values(Move);
        const move = moves[Math.floor(Math.random() * moves.length)];
        return Promise.resolve(move);
    }
}
