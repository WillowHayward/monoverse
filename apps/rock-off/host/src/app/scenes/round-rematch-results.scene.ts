import { RockOff } from "../game/rock-off";
import { Button } from "../objects/button";
import { Scene } from "./scene";

export class RoundRematchResultsScene extends Scene {
    constructor() {
        super({key: 'RoundRematchResults'});
    }

    async create() {
        const game = RockOff.get();
        const results = await game.getRound().getRematchResults();
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

        if (results.some(result => result.draw)) {
            const btnRematches = new Button(this, this.width / 2, this.height - 200, 'Run Rematches');
            btnRematches.on('click', () => {
                game.startRematches();
            });
            this.add.existing(btnRematches);
        } else {
            const btnNext = new Button(this, this.width / 2, this.height - 200, 'Next Round');
            btnNext.on('click', () => {
                game.nextRound();
            });
            this.add.existing(btnNext);
        }
    }
}
