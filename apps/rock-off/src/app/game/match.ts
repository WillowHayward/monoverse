import { Move } from "@whc/rock-off/common";
import { Result } from "../game.model";
import { Contestant } from "./contestants";

export class Match {
    private result: Promise<Result> | undefined;
    private winner: Contestant;
    private loser: Contestant;

    constructor(private a: Contestant, private b: Contestant) {}

    public getContestants(): [Contestant, Contestant] {
        return [this.a, this.b];
    }

    public async getResult(): Promise<Result> {
        if (this.result) {
            return this.result;
        }

        const a = this.a;
        const b = this.b;

        const moves: Promise<Move>[] = [];
        moves.push(a.getMove());
        moves.push(b.getMove());

        this.result = Promise.all(moves).then(([moveA, moveB]) => {
            const result = this.determineWinner(moveA, moveB);

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

            this.winner = winner;
            this.loser = loser;

            return {
                draw: false,
                contestants: [
                    a, b
                ],
                winner,
                loser
            }
        });

        return this.result;
    }

    public getWinner(): Contestant {
        return this.winner;
    }

    public getLoser(): Contestant {
        return this.loser;
    }

    public reset() {
        this.result = undefined;
    }

    // Return -1 for a winning, 0 for draw, 1 for b winning
    private determineWinner(a: Move, b: Move): number {
        if (a === b) {
            return 0;
        }

        switch (a) {
            case Move.ROCK:
                if (b === Move.SCISSORS) {
                    return -1;
                }
                break;
            case Move.PAPER:
                if (b === Move.ROCK) {
                    return -1;
                }
                break;
            case Move.SCISSORS:
                if (b === Move.PAPER) {
                    return -1;
                }
                break;
        }

        return 1;
    }
}
