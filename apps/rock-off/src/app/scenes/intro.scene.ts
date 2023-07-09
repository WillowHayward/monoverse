import { Scene } from "@whc/phaser";
import { RockOff } from "../game/rock-off";
import { GAME_STATE, SceneKeys } from "../game.model";

export class IntroScene extends Scene {
    constructor() {
        const key = SceneKeys[GAME_STATE.INTRO];
        super({key});
    }

    create() {
        RockOff.get().startGame();
    }
}
