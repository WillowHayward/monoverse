import { Move } from "@whc/rock-off/common";

export abstract class Contestant {
    protected currentMove: Promise<Move>;
    constructor(public name: string, public bot: boolean) {
    }

    public abstract getMove(): Promise<Move>;

    public getCurrentMove(): Promise<Move> {
        return this.currentMove;
    }
}
