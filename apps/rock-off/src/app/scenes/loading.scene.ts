import { Scene } from "@whc/phaser";
import { GAME_STATE, SceneKeys } from "../game.model";

export class LoadingScene extends Scene {
    constructor() {
        const key = SceneKeys[GAME_STATE.LOADING];
        super({key});
    }

    create() {
        const loading = this.add.text(this.width / 2, this.height / 2, 'Loading...', {
            align: 'center',
            fontFamily: 'arial',
            fontSize: '20vh',
            color: 'black'
        });
        loading.setOrigin(0.5, 0.5);
    }
}
