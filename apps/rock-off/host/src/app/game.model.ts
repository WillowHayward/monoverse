import { Move } from "@whc/rock-off/common";
import { Contestant } from "./game/contestants";

export interface Result {
    draw: boolean;
}

export interface DecisiveResult extends Result {
    draw: false;
    winner: Contestant;
    loser: Contestant;
}

export interface BotProfile {
    name: string;
    tactic: Move; // TODO: Later, make this a weighted distribution
}
