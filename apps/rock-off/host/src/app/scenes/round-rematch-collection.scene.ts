import { GameObjects } from "phaser";
import { RockOff } from "../game/rock-off";
import { Scene } from "./scene";

export class RoundRematchCollectionScene extends Scene {
    private moveStatuses: {[name: string]: boolean} = {};
    private moveStatusDisplay: GameObjects.Text;

    constructor() {
        super({key: 'RoundRematchCollection'});
    }

    create() {
        const game = RockOff.get();
        const contestants = game.getRound().getRematchContestants();
        for (const contestant of contestants) {
            this.moveStatuses[contestant.name] = false;
            contestant.getCurrentMove().then(() => {
                this.moveStatuses[contestant.name] = true;
                this.drawMoveStatuses();
            });
        }

        this.drawMoveStatuses();
    }

    private drawMoveStatuses() {
        if (this.moveStatusDisplay) {
            this.moveStatusDisplay.destroy();
        }

        const statuses: string[] = [];
        for (const name in this.moveStatuses) {
            const status = this.moveStatuses[name];
            statuses.push(`${name}: ${status ? 'Move submitted' : 'Waiting for move'}`);
        }

        this.moveStatusDisplay = this.add.text(50, 50, statuses.join('\n'), {
            fontFamily: 'arial',
            fontSize: '5vh',
            color: 'black'
        });
    }
}
