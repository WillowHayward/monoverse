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

export enum GAME_STATE {
    LOADING,
    LOBBY,
    INTRO,
    BRACKET,
    MATCHUP,
    COLLECTION,
    RESULT,
    WINNER,
}

export const SceneKeys  = {
    [GAME_STATE.LOADING]: 'Loading',
    [GAME_STATE.LOBBY]: 'Lobby',
    [GAME_STATE.INTRO]: 'Intro',
    [GAME_STATE.BRACKET]: 'Bracket',
    [GAME_STATE.MATCHUP]: 'Matchup',
    [GAME_STATE.COLLECTION]: 'Collection',
    [GAME_STATE.RESULT]: 'Result',
    [GAME_STATE.WINNER]: 'Winner',
}
