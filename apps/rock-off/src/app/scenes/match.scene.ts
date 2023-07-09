import { Scene, SecondsTimer } from "@whc/phaser";
import { GAME_STATE, SceneKeys } from "../game.model";
import { defaultTextStyle } from "../game.styles";
import { RockOff } from "../game/rock-off";

export class MatchScene extends Scene {
    constructor() {
        const key = SceneKeys[GAME_STATE.MATCH];
        super({key});
    }

    create() {
        const game = RockOff.get();
        const round = game.getRound();
        const match = round.getCurrentMatch();
        const [a, b] = match.getContestants();

        const display = this.add.text(this.width / 2, this.height / 2, `${a.name} vs ${b.name}`, {
            ...defaultTextStyle,
            fontSize: '10vh'
        });
        display.setOrigin(0.5, 0.5);

        // TODO: This is where the matchup display would go
        const timer = new SecondsTimer(this, this.width / 2, this.height / 2 + display.height, 3, {
            ...defaultTextStyle,
            fontSize: '5vh'
        }, 'Match Starts In ');
        timer.setOrigin(0.5, 0.5);
        this.add.existing(timer);
        timer.on('done', () => {
            game.startMatch();
        });
    }
}
