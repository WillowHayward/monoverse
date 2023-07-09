import { GAME_STATE, SceneKeys } from "../game.model";
import { defaultTextStyle } from "../game.styles";
import { RockOff } from "../game/rock-off";
import { Button, Scene, SecondsTimer } from "@whc/phaser";

export class ResultsScene extends Scene {
    constructor() {
        const key = SceneKeys[GAME_STATE.RESULT];
        super({ key });
    }

    async create() {
        const game = RockOff.get();
        const round = game.getRound();
        const match = round.getCurrentMatch();
        const result = await match.getResult();
        let display: string;

        let timerCallback: () => void;
        let timerPrefix: string;

        if (result.winner) {
            display = `${result.winner.name} beat ${result.loser.name}`;
            timerPrefix = 'Next Match In ';
            timerCallback = () => {
                game.nextMatch();
            }
        } else {
            display = 'Draw! Rematch';
            timerPrefix = 'Rematch In ';
            timerCallback = () => {
                game.startMatch();
            }
        }

        const displayText = this.add.text(this.width / 2, this.height / 2, display, {
            fontFamily: 'arial',
            fontSize: '10vh',
            color: 'black'
        });
        displayText.setOrigin(0.5, 0.5);

        const timer = new SecondsTimer(this, this.width / 2, this.height / 2 + displayText.height, 3, {
            ...defaultTextStyle,
            fontSize: '5vh'
        }, timerPrefix);
        timer.setOrigin(0.5, 0.5);
        this.add.existing(timer);
        timer.on('done', () => {
            timerCallback();
        });
    }
}
