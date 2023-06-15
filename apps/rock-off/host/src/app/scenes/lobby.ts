import { GameObjects } from "phaser";
import { Scene } from "./scene";
import { Game } from "../game/game";

export class LobbyScene extends Scene {
    private playerList: GameObjects.Text;
    private players: string[] = [];
    constructor() {
        super({key: 'Lobby'});
    }

    preload() {
        super.preload();
    }

    create() {
        const style = {
            align: 'center',
            fontFamily: 'arial',
            color: 'black'
        }

        const game = Game.get();
        const room = game.getRoom();

        let y = 20;
        const header = this.add.text(this.width / 2, y, room, {
            ...style,
            fontSize: '20vh',
        });
        header.x -= header.displayWidth / 2;

        y += header.displayHeight + 20;
        const subheader = this.add.text(this.width / 2, y, 'Players', {
            ...style,
            fontSize: '10vh',
        });
        subheader.x -= subheader.displayWidth / 2;

        y += subheader.displayHeight + 20;
        this.playerList = this.add.text(this.width / 2, y, '', {
            ...style,
            fontSize: '5vh'
        });

        game.on('joined', (name: string) => {
            this.addPlayer(name);
        });
    }

    addPlayer(name: string) {
        this.players.push(name);
        this.playerList.setText(this.players.join('\n'));
        this.playerList.x = this.width / 2 - this.playerList.displayWidth / 2;
    }
}

