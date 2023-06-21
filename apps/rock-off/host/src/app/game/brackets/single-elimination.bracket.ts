import { Bracket } from "./bracket";
import { Round } from "../round";
import { Contestant } from "../contestants";

export class SingleEliminationBracket extends Bracket {
    constructor(private contestants: Contestant[]) {
        super();
    }

    public override nextRound(): Round {
        let contestants: Contestant[];
        if (this.rounds.length) {
            const lastRound = this.rounds[this.rounds.length - 1];
            contestants = lastRound.getWinners();
        } else {
            contestants = this.contestants;
        }

        const round = new Round(contestants, this.rounds.length + 1)
        this.rounds.push(round);

        return round;
    }
}
