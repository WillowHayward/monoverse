import { RockOff } from "../game/rock-off";
import { Scene } from "@whc/phaser";

export class WinnerScene extends Scene {
    constructor() {
        super({key: 'Winner'});
    }

    create() {
        const game = RockOff.get();
        const winner = game.getWinner();
        const text = this.add.text(this.width / 2, this.height / 2, `${winner.name} Wins!`, {
            fontFamily: 'arial',
            color: 'black',
            fontSize: '20vh'
        });
        text.setOrigin(0.5, 0.5);
    }
}
