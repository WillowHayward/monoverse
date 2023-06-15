import { Game as PhaserGame, Events } from 'phaser';
import { Host, Lipwig, User } from '@whc/lipwig/js';

import { Bracket, SingleEliminationBracket } from './brackets';
import { Contestant, Player } from './contestants';
import { Round } from './round';
import { Result } from '../game.model';

const LIPWIG_URL = 'ws://localhost:8989';

export class Game extends Events.EventEmitter {
    private static singleton: Game;
    private scene: string;
    private contestants: Contestant[];
    private bracket: Bracket;
    public host: Host;

    private constructor(public game: PhaserGame) {
        super();
        console.log('creating game');
        this.scene = 'Menu';
    }

    public startLobby() {
        this.changeScene('Loading');
        Lipwig.create(LIPWIG_URL).then(host => {
            this.setHost(host);
            this.changeScene('Lobby');
        })
    }

    public start() {
        this.contestants = [];
        const users = this.host.getUsers();
        for (const user of users) {
            const player = new Player(user);
            this.contestants.push(player);
        }

        this.bracket = new SingleEliminationBracket(this.contestants);
        this.bracket.nextRound()

        this.changeScene('Bracket');
    }

    public startRound() {
        const round = this.bracket.getCurrentRound();
        round.start().then((results: Result[]) => {
            console.log(results);
        });
    }

    public getRoom(): string {
        return this.host.room;
    }

    public getRound(): Round {
        return this.bracket.getCurrentRound();
    }

    public getPlayers(): string[] {
        const players: string[] = this.host.getUsers().map(user => user.data['name']);

        return players;
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
        Game.singleton.startLobby();
    }

    static get(): Game {
        return Game.singleton;
    }
}
