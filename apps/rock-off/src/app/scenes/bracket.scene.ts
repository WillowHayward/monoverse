import { GameObjects } from "phaser";
import { RockOff } from "../game/rock-off";
import { Round } from "../game/round";
import { Scene, SecondsTimer } from "@whc/phaser";
import { defaultTextStyle } from "../game.styles";

export class BracketScene extends Scene {
    private info: string[] = []; // TODO: Needs better name (and structure, tbh)
    private infoText: GameObjects.Text;

    constructor() {
        super({key: 'Bracket'});
    }

    create() {
        this.infoText = this.add.text(200, 200, '', {
            ...defaultTextStyle,
            fontSize: '5vh',
        });

        const game = RockOff.get();
        const round = game.getRound();
        this.addRound(round);

        const timer = new SecondsTimer(this, this.width / 2, this.height - 100, 10, {
            ...defaultTextStyle,
            fontSize: '10vh'
        }, 'Round starting in ');
        timer.setOrigin(0.5, 1);
        this.add.existing(timer);
        timer.on('done', () => {
            game.startRound();
        });
    }

    private addRound(round: Round) {
        const pairings = round.getPairings();
        const listings: string[] = [];

        for (const pairing of pairings) {
            const [a, b] = pairing;
            listings.push(`${a.name} v. ${b.name}`);
        }

        const info = `Round ${round.number}: ${listings.join(', ')}`;

        this.addInfo(info);
    }

    private addInfo(info: string) {
        this.info.push(info);
        const text = this.info.join('\n');

        this.infoText.setText(text);
    }
}
