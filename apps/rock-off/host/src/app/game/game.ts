import { Game as PhaserGame, Events } from 'phaser';
import { Host, Lipwig, User } from '@whc/lipwig/js';

const LIPWIG_URL = 'ws://localhost:8989';

export class Game extends Events.EventEmitter {
    private static singleton: Game;
    private scene: string;
    public host: Host;

    private constructor(public game: PhaserGame) {
        super();
        console.log('creating game');
        this.scene = 'Menu';
    }

    public startGame() {
        this.changeScene('Loading');
        console.log(LIPWIG_URL);
        Lipwig.create(LIPWIG_URL).then(host => {
            this.setHost(host);
            this.changeScene('Lobby');
        })
    }

    public getRoom(): string {
        return this.host.room;
    }

    private changeScene(scene: string) {
        this.game.scene.stop(this.scene);
        this.scene = scene;
        this.game.scene.start(this.scene);
    }

    private setHost(host: Host) {
        this.host = host;
        host.on('joined', (user: User) => {
            this.emit('joined', user.data['name']);
        });
    }

    static init(game: PhaserGame) {
        Game.singleton = new Game(game);
        Game.singleton.startGame();
    }

    static get(): Game {
        return Game.singleton;
    }
}
