import { Contestant, Bot } from "./contestants";
import { Result } from "../game.model";
import { Move } from "@whc/rock-off/common";

type Pairing = [Contestant, Contestant];

export class Round {
    private pairings: Pairing[] = [];
    private winners: Contestant[] = [];
    private losers: Contestant[] = [];
    private results: Promise<Result[]>;
    private rematches: Pairing[] = [];
    private rematchResults: Promise<Result[]>;

    constructor(private contestants: Contestant[], public number: number) {
        if (contestants.length % 2 === 1) {
            // Uneven players, add bot
            const bot = new Bot();
            contestants.push(bot);
        }

        for (let i = 0; i < contestants.length; i += 2) {
            this.pairings.push([
                contestants[i], contestants[i + 1]
            ]);
        }
    }

    public start(): Promise<Result[]> {
        const results: Promise<Result>[] = [];
        for (const pairing of this.pairings) {
            const result = this.getResult(pairing);
            results.push(result);
        }

        this.results = Promise.all(results);
        this.results.then(results => {
            const rematches = results.filter(result => result.draw);
            this.rematches = rematches.map(result => result.contestants);
        });
        return this.results;
    }

    public startRematches(): Promise<Result[]> {
        const results: Promise<Result>[] = [];
        for (const pairing of this.rematches) {
            const result = this.getResult(pairing);
            results.push(result);
        }

        this.rematchResults = Promise.all(results);
        this.rematchResults.then(results => {
            const rematches = results.filter(result => result.draw);
            this.rematches = rematches.map(result => result.contestants);
        });
        return this.rematchResults;
    }

    public getResults(): Promise<Result[]> {
        if (this.rematchResults) {
            return this.rematchResults;
        }
        return this.results;
    }

    private async getResult(pairing: Pairing): Promise<Result> {
        const [a, b] = pairing;
        const moves: Promise<Move>[] = [];
        moves.push(a.getMove());
        moves.push(b.getMove());

        return Promise.all(moves).then(([moveA, moveB]) => {
            const result = this.getWinner(moveA, moveB);

            let winner: Contestant;
            let loser: Contestant;
            if (result === 0) {
                return {
                    draw: true,
                    contestants: [a, b]
                };
            } else if (result === -1) {
                winner = a;
                loser = b;
            } else if (result === 1) {
                winner = b;
                loser = a;
            }

            this.winners.push(winner);
            this.losers.push(loser);

            return {
                draw: false,
                contestants: [
                    a, b
                ],
                winner,
                loser
            }
        });
    }

    public getContestants(): Contestant[] {
        return this.contestants;
    }

    public getPairings(): Pairing[] {
        if (this.rematches.length) {
            return this.rematches;
        }
        return this.pairings;
    }

    public getWinners(): Contestant[] {
        return this.winners;
    }

    public getLosers(): Contestant[] {
        return this.losers;
    }

    // Return -1 for a winning, 0 for draw, 1 for b winning
    private getWinner(a: Move, b: Move): number {
        if (a === b) {
            return 0;
        }

        switch (a) {
            case Move.ROCK:
                if (b === Move.SCISSORS) {
                    return -1;
                } else {
                    return 1;
                }
            case Move.PAPER:
                if (b === Move.ROCK) {
                    return -1;
                } else {
                    return 1;
                }
            case Move.SCISSORS:
                if (b === Move.PAPER) {
                    return -1;
                } else {
                    return 1;
                }
        }
    }
}
