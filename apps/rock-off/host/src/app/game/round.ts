import { Contestant, Bot } from "./contestants";
import { Result } from "../game.model";
import { Move } from "@whc/rock-off/common";

type Pairing = [Contestant, Contestant];

export class Round {
    private pairings: Pairing[] = [];
    private winners: Contestant[] = [];
    private losers: Contestant[] = [];

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

        return Promise.all(results);
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
                return { draw: true };
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
                winner,
                loser
            }
        });
    }

    public getContestants(): Contestant[] {
        return this.contestants;
    }

    public getPairings(): Pairing[] {
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
