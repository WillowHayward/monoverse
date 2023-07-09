import { GameObjects } from "phaser";
import { RockOff } from "../game/rock-off";
import { Scene } from "@whc/phaser";
import { GAME_STATE, SceneKeys } from "../game.model";

export class CollectionScene extends Scene {
    private statuses: {[name: string]: boolean} = {};
    private moveStatusDisplay: GameObjects.Text;

    constructor() {
        const key = SceneKeys[GAME_STATE.COLLECTION];
        super({key});
    }

    create() {
        const game = RockOff.get();
        const round = game.getRound();
        const match = round.getCurrentMatch();
        const contestants = match.getContestants();
        for (const contestant of contestants) {
            this.statuses[contestant.name] = false;
            contestant.getCurrentMove().then(() => {
                this.statuses[contestant.name] = true;
                this.drawMoveStatuses();
            });
        }
        this.drawMoveStatuses();
    }

    private drawMoveStatuses() {
        if (this.moveStatusDisplay) {
            this.moveStatusDisplay.destroy();
        }

        const text: string[] = [];
        for (const name in this.statuses) {
            const status = this.statuses[name];
            text.push(`${name}(${status ? 'Submitted' : 'Waiting'})`);
        }

        this.moveStatusDisplay = this.add.text(this.width / 2, this.height / 2, text.join(' vs '), {
            fontFamily: 'arial',
            fontSize: '10vh',
            color: 'black'
        });
        this.moveStatusDisplay.setOrigin(0.5, 0.5);
    }
}
