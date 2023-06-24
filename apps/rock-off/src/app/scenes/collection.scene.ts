import { GameObjects } from "phaser";
import { RockOff } from "../game/rock-off";
import { Scene } from "@whc/phaser";

export class CollectionScene extends Scene {
    private moveStatuses: {[name: string]: boolean}[] = [];
    private moveStatusDisplay: GameObjects.Text;

    constructor() {
        super({key: 'Collection'});
    }

    create() {
        this.moveStatuses = [];
        const game = RockOff.get();
        const pairings = game.getRound().getPairings();
        for (const pairing of pairings) {
            const statuses = {}

            for (const contestant of pairing) {
                statuses[contestant.name] = false;
                contestant.getCurrentMove().then(() => {
                    statuses[contestant.name] = true;
                    this.drawMoveStatuses();
                });
            }
            this.moveStatuses.push(statuses);
        }
        this.drawMoveStatuses();
    }

    private drawMoveStatuses() {
        if (this.moveStatusDisplay) {
            this.moveStatusDisplay.destroy();
        }

        const statuses: string[] = [];
        for (const pairing of this.moveStatuses) {
            const text: string[] = [];
            for (const name in pairing) {
                const status = pairing[name];
                text.push(`${name}(${status ? 'Waiting' : 'Submitted'})`);
            }
            statuses.push(text.join(' vs '));
        }

        this.moveStatusDisplay = this.add.text(50, 50, statuses.join('\n'), {
            fontFamily: 'arial',
            fontSize: '5vh',
            color: 'black'
        });
    }
}