import { Move } from "@whc/rock-off/common";
import { Contestant } from "./game/contestants";

export interface Result {
    draw: boolean;
    contestants: [Contestant, Contestant],
    winner?: Contestant;
    loser?: Contestant;
}

export interface DecisiveResult extends Result {
    draw: false;
    contestants: [Contestant, Contestant],
    winner: Contestant;
    loser: Contestant;
}

export interface BotProfile {
    name: string;
    tactic: Move; // TODO: Later, make this a weighted distribution
}
