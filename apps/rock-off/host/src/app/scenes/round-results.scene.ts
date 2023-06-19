import { Game } from "../game/game";
import { Scene } from "./scene";
import { Result } from "../game.model";

export class RoundResultsScene extends Scene {
    constructor() {
        super({key: 'RoundResults'});
    }

    create() {
        const game = Game.get();
        game.getRound().getResults().then((results: Result[]) => {
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
        });

    }
}
