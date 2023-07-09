import { Scene } from "@whc/phaser";
import { GAME_STATE, SceneKeys } from "../game.model";

export class CoinFlipScene extends Scene {
    constructor() {
        const key = SceneKeys[GAME_STATE.COINFLIP];
        super({key});
    }
}
