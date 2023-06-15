import { GameObjects } from "phaser";
import { Game } from "../game/game";
import { Round } from "../game/round";
import { Scene } from "./scene";

export class BracketScene extends Scene {
    private info: string[] = []; // TODO: Needs better name (and structure, tbh)
    private infoText: GameObjects.Text;

    constructor() {
        super({key: 'Bracket'});
    }

    create() {
        this.infoText = this.add.text(200, 200, '', {
            align: 'center',
            fontFamily: 'arial',
            fontSize: '5vh',
            color: 'black'
        });

        const round = Game.get().getRound();
        this.addRound(round);
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
        console.log(text);

        this.infoText.setText(text);
    }
}
