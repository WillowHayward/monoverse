import { Contestant, Bot } from "./contestants";
import { Match } from "./match";

export class Round {
    private matches: Match[] = [];
    private current = 0;

    constructor(private contestants: Contestant[], public number: number) {
        if (contestants.length % 2 === 1) {
            // Uneven players, add bot
            const bot = new Bot();
            contestants.push(bot);
        }

        for (let i = 0; i < contestants.length; i += 2) {
            const match = new Match(contestants[i], contestants[i + 1]);
            this.matches.push(match);
        }
    }

    public next(): Match | undefined {
        this.current++;

        return this.getCurrentMatch();
    }

    public getCurrentMatch(): Match {
        return this.matches[this.current];
    }

    public getContestants(): Contestant[] {
        return this.contestants;
    }

    public getMatches(): Match[] {
        return this.matches;
    }

    public getWinners(): Contestant[] {
        return this.matches.map(match => match.getWinner());
    }

    public getLosers(): Contestant[] {
        return this.matches.map(match => match.getLoser());
    }
}
