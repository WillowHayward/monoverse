import { Game as PhaserGame, Events } from 'phaser';
import { Host, JoinRequest, Lipwig, User } from '@whc/lipwig/js';

import { Bracket, SingleEliminationBracket } from './brackets';
import { Contestant, Player } from './contestants';
import { Round } from './round';

const LIPWIG_URL = 'ws://localhost:8989';

export class Game extends Events.EventEmitter {
    private static singleton: Game;
    private scene: string;
    private players: Player[] = [];
    private bracket: Bracket;
    private winner: Contestant;
    public host: Host;

    private constructor(public game: PhaserGame) {
        super();
        this.scene = 'Menu';
    }

    public startLobby() {
        this.changeScene('Loading');
        Lipwig.create(LIPWIG_URL, {
            approvals: true
        }).then(host => {
            this.setHost(host);
            this.changeScene('Lobby');
        })
    }

    public start() {
        this.host.lock('Game In Progress');
        this.bracket = new SingleEliminationBracket(this.players);
        this.bracket.nextRound()

        this.changeScene('Bracket');
    }

    public nextRound() {
        if (this.bracket.getCurrentRound().getWinners().length === 1) {
            this.winner = this.bracket.getCurrentRound().getWinners().pop();
            this.changeScene('Winner');
            return;
        }
        this.bracket.nextRound();
        this.changeScene('Bracket');
    }

    public startRound() {
        const round = this.bracket.getCurrentRound();
        round.start().then(() => {
            this.changeScene('RoundResults');
        });
        this.changeScene('RoundCollection');
    }

    public startRematches() {
        const round = this.bracket.getCurrentRound();
        round.startRematches().then(() => {
            this.changeScene('RoundRematchResults');
        });
        this.changeScene('RoundRematchCollection');
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

    public getWinner(): Contestant {
        return this.winner;
    }

    private changeScene(scene: string) {
        this.game.scene.stop(this.scene);
        this.scene = scene;
        this.game.scene.start(this.scene);
    }

    private setHost(host: Host) {
        this.host = host;
        host.on('join-request', (request: JoinRequest, data: {[key: string]: any}) => {
            const name = data['name'];
            if (this.players.some(player => player.name === name)) {
                request.reject(`Player with name ${name} already in room`);
            } else {
                request.approve();
            }
        });

        host.on('joined', (user: User) => {
            const player = new Player(user);
            this.players.push(player);
            this.emit('joined', player);
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
