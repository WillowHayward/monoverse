import { Scene, SecondsTimer } from "@whc/phaser";
import { RockOff } from "../game/rock-off";
import { GAME_STATE, SceneKeys } from "../game.model";
import { defaultTextStyle } from "../game.styles";

export class IntroScene extends Scene {
    constructor() {
        const key = SceneKeys[GAME_STATE.INTRO];
        super({key});
    }

    create() {
        const timer = new SecondsTimer(this, this.width / 2, this.height / 2, 3, {
            ...defaultTextStyle,
            fontSize: '20vh'
        }, 'Game Starting In ');
        timer.setOrigin(0.5, 0.5);
        this.add.existing(timer);

        timer.on('done', () => {
            RockOff.get().startGame();
        });
    }
}
