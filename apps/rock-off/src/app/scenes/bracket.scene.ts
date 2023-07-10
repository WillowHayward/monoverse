import { GameObjects } from "phaser";
import { RockOff } from "../game/rock-off";
import { Round } from "../game/round";
import { Scene, SecondsTimer } from "@whc/phaser";
import { defaultTextStyle } from "../game.styles";
import { GAME_STATE, SceneKeys } from "../game.model";

// TODO: Each new round, animate the winners moving up the bracket
export class BracketScene extends Scene {
    private info: string[] = []; // TODO: Needs better name (and structure, tbh)
    private infoText: GameObjects.Text;

    constructor() {
        const key = SceneKeys[GAME_STATE.BRACKET];
        super({key});
    }

    create() {
        this.info = [];
        this.infoText = this.add.text(this.width / 2, this.height / 2, '', {
            ...defaultTextStyle,
            fontSize: '10vh',
        });
        this.infoText.setOrigin(0.5, 0.5);

        const game = RockOff.get();
        const round = game.getRound();
        this.addRound(round);

        const timer = new SecondsTimer(this, this.width / 2, this.height / 2 + this.infoText.height, 3, {
            ...defaultTextStyle,
            fontSize: '5vh'
        }, 'Round starting in ');
        timer.setOrigin(0.5, 1);
        this.add.existing(timer);
        timer.on('done', () => {
            game.showMatch();
        });
    }

    private addRound(round: Round) {
        const matches = round.getMatches();
        const listings: string[] = [];

        for (const match of matches) {
            const [a, b] = match.getContestants();
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
