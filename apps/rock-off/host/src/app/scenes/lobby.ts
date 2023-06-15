import { GameObjects } from "phaser";
import { Scene } from "./scene";
import { Game } from "../game/game";
import { Button } from "../objects/button";
import { Player } from "../game/contestants";

export class LobbyScene extends Scene {
    private players: Player[] = [];
    private bracket: GameObjects.Group;
    private maxPlayers = 8;
    private room: string;

    private joinText: GameObjects.Text;
    constructor() {
        super({key: 'Lobby'});
    }

    preload() {
        super.preload();
    }

    create() {
        this.bracket = this.add.group();

        const style = {
            align: 'center',
            fontFamily: 'arial',
            color: 'black'
        }

        const game = Game.get();
        this.room = game.getRoom();

        this.joinText = this.add.text(10, 10, '', {
            ...style,
            fontSize: '5vh',
        });


        // TODO: Move to client input
        const btnStart = new Button(this, this.width / 2, this.height - 200, 'Start Game');
        btnStart.on('click', () => {
            game.start();
        });
        btnStart.setOrigin(0.5, 1);
        this.add.existing(btnStart);


        game.on('joined', (player: Player) => {
            this.addPlayer(player);
        });

        this.drawBracket();
        this.drawJoin();
    }

    private addPlayer(player: Player) {
        this.players.push(player);
        this.drawBracket();
        this.drawJoin();
    }

    private drawJoin() {
        const remaining = this.maxPlayers - this.players.length;

        let remainingText: string;
        if (remaining) {
            remainingText = `${remaining} slots remaining`;
        } else {
            remainingText = 'Room full';
        }
        this.joinText.setText(`${this.room} - ${remainingText}`);
    }

    private drawBracket() {
        this.bracket.clear(true, true);
        const border = 50;
        const maxHeight = this.height - border * 2;
        const maxContestants = 8;

        const vSpacing = maxHeight / maxContestants;


        let numContestants = this.players.length;
        if (numContestants % 2 === 1) {
            numContestants++;
        }


        // TODO: Tighten this (and subfunctions) up to be centered
        let x = 300;
        let y = border;
        let hSpacing = 30;
        const textStyle = {
            fontFamily: 'arial',
            color: 'black',
            fontSize: '5vh'
        };
        const names = this.players.map(player => player.name);
        const winnerX = this.drawBracketLayer([names], x, y, hSpacing, vSpacing, numContestants);
        const winnerText = new GameObjects.Text(this, winnerX, y + vSpacing / 2, 'The Winner', textStyle);
        this.bracket.add(winnerText, true);
    }

    private drawBracketLayer(names: string[][], x: number, y: number, hSpacing: number, vSpacing: number, numContestants: number): number {
        numContestants = Math.ceil(numContestants);
        if (numContestants < 2) {
            return x;
        }

        let localY = y;

        const localNames = names.shift() || [];
        for (let i = 0; i < numContestants; i+= 2) {
            const a = localNames[i];
            const b = localNames[i + 1];
            this.drawSingleBracket(x, localY, hSpacing, vSpacing, a, b);
            localY += vSpacing * 2;
        }
        x += 200 + hSpacing * 2;
        y += vSpacing / 2;
        vSpacing *= 2;

        numContestants /= 2;
        return this.drawBracketLayer(names, x, y, hSpacing, vSpacing, numContestants);
    }

    // hSpacing
    // vSpacing
    // left: string
    // right: string | null (floating)
    // winner: string | null
    private drawSingleBracket(xOffset: number, yOffset: number, hSpacing: number, vSpacing: number, 
        name1?: string, name2?: string): number {
        const textStyle = {
            fontFamily: 'arial',
            color: 'black',
            fontSize: '5vh'
        };
        const group = this.bracket;
        const textHeight = 38; // TODO: Drawn from text height

        const nameWidth = 200;

        let x = xOffset + nameWidth / 2;

        if (!name1) {
            name1 = '?';
        }

        const name1Object = new GameObjects.Text(this, x, yOffset, name1, textStyle);
        name1Object.setOrigin(0.5, 0);
        group.add(name1Object, true);

        if (!name2) {
            name2 = '?';
        }

        const name2Object = new GameObjects.Text(this, x, yOffset + vSpacing, name2, textStyle);
        name2Object.setOrigin(0.5, 0);
        group.add(name2Object, true);

        x += nameWidth / 2;

        const upperLine = new GameObjects.Line(this, x, yOffset + textHeight / 2, 0, 0, hSpacing, 0, 0x000000);
        upperLine.setOrigin(0, 0);
        group.add(upperLine, true);

        const lowerLine = new GameObjects.Line(this, x, yOffset + vSpacing + textHeight / 2, 0, 0, hSpacing, 0, 0x000000);
        lowerLine.setOrigin(0, 0);
        group.add(lowerLine, true);

        x += hSpacing;

        const verticalLine = new GameObjects.Line(this, x, yOffset + textHeight / 2, 0, 0, 0, vSpacing, 0x000000);
        verticalLine.setOrigin(0, 0);
        group.add(verticalLine, true);

        const winnerLine = new GameObjects.Line(this, x, yOffset + textHeight / 2 + vSpacing / 2, 0, 0, hSpacing, 0, 0x000000);
        winnerLine.setOrigin(0, 0);
        group.add(winnerLine, true);

        x += hSpacing;

        /*const winnerText = new GameObjects.Text(this, x, yOffset + textHeight / 2 + vSpacing / 2, winner, textStyle);
        winnerText.setOrigin(0, 0.5);
        group.add(winnerText, true);

        console.log(winnerText.displayWidth);*/

        return x;
    }
}

