import { defaultTextStyle } from "../game.styles";
import { RockOff } from "../game/rock-off";
import { Button, Scene, SecondsTimer } from "@whc/phaser";

export class ResultsScene extends Scene {
    constructor() {
        super({key: 'Results'});
    }

    async create() {
        const game = RockOff.get();
        const results = await game.getRound().getResults();
        let display: string[] = [];
        for (const result of results) {
            const [a, b] = result.contestants;
            let displayString = `${a.name} vs ${b.name}:`;
            if (result.draw) {
                displayString += 'Draw! Rematch';
            } else {
                displayString += `${result.winner.name} wins!`;
            }
            display.push(displayString);
        }

        this.add.text(50, 50, display.join('\n'), {
            fontFamily: 'arial',
            fontSize: '5vh',
            color: 'black'
        });

        let timerPrefix: string;
        let timerCallback: () => void;
        if (results.some(result => result.draw)) {
            timerPrefix = 'Running rematches in ';
            timerCallback = () => {
                game.startRematches();
            }
        } else {
            timerPrefix = 'Next round in ';
            timerCallback = () => {
                game.nextRound();
            }
        }
        const timer = new SecondsTimer(this, this.width / 2, this.height - 100, 10, {
            ...defaultTextStyle,
            fontSize: '10vh'
        }, timerPrefix);
        timer.setOrigin(0.5, 1);
        this.add.existing(timer);
        timer.on('done', () => {
            timerCallback();
        });
    }
}
