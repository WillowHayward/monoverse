import { Round } from "../round";

export abstract class Bracket {
    protected rounds: Round[] = [];

    public abstract nextRound(): Round;

    public getCurrentRound(): Round {
        return this.rounds[this.rounds.length - 1];
    }
}
