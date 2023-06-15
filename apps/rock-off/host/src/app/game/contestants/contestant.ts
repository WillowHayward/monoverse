import { Move } from "@whc/rock-off/common";

export abstract class Contestant {
    constructor(public name: string, public bot: boolean) {
    }

    public abstract getMove(): Promise<Move>;
}
