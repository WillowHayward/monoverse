import { Round } from "./round";
import { Contestant } from "./contestants";

export class Bracket {
    protected rounds: Round[] = [];
    constructor(private contestants: Contestant[]) {
    }

    public nextRound(): Round {
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

    public getCurrentRound(): Round {
        return this.rounds[this.rounds.length - 1];
    }
}
