import { Game as PhaserGame } from 'phaser';
import { Host, Lipwig } from '@whc/lipwig/js';

const LIPWIG_URL = 'ws://localhost:8989';

export class Game {
    private static singleton: Game;
    private scene: string;
    public host: Host;

    private constructor(public game: PhaserGame) {
        console.log('creating game');
        this.scene = 'Menu';
    }

    public startGame() {
        this.changeScene('Loading');
        console.log(LIPWIG_URL);
        Lipwig.create(LIPWIG_URL).then(host => {
            this.host = host;
            this.changeScene('Lobby');
        })
    }

    public static getRoom(): string {
        const game = this.get();
        return game.host.room;
    }

    private changeScene(scene: string) {
        this.game.scene.stop(this.scene);
        this.scene = scene;
        this.game.scene.start(this.scene);
    }

    static init(game: PhaserGame) {
        Game.singleton = new Game(game);
        Game.singleton.startGame();
    }

    static get(): Game {
        return Game.singleton;
    }
}
