import { Round } from "./round";
import { Contestant } from "./contestants";

export class Bracket {
    protected rounds: Round[] = [];
    private current = 0;
    constructor(private contestants: Contestant[]) { }

    public next(): Round | undefined {
        let contestants: Contestant[];
        if (this.rounds.length) {
            const lastRound = this.rounds[this.current];
            contestants = lastRound.getWinners();
            if (contestants.length === 1) {
                return undefined;
            }

            this.current++;
        } else {
            contestants = this.contestants;
        }

        const round = new Round(contestants, this.current + 1)
        this.rounds.push(round);

        return round;
    }

    public getCurrentRound(): Round {
        return this.rounds[this.current];
    }
}
