import { Game, Events } from 'phaser';
import { Host, JoinRequest, Lipwig, User } from '@whc/lipwig/js';

import { Bracket } from './bracket';
import { Contestant, Player } from './contestants';
import { Round } from './round';

const LIPWIG_URL = 'ws://localhost:8989';

export class RockOff extends Events.EventEmitter {
    private static singleton: RockOff;
    private scene: string;
    private players: Player[] = [];
    private bracket: Bracket;
    private winner: Contestant;
    public host: Host;

    private constructor(public game: Game) {
        super();
        this.scene = 'Menu';
    }

    public startLobby() {
        this.changeScene('Loading');
        Lipwig.create(LIPWIG_URL, {
            name: 'rock-off',
            approvals: true,
        }).then(host => {
            this.setHost(host);
            this.changeScene('Lobby');
        })
    }

    public start() {
        this.host.lock('Game In Progress');
        this.host.sendToAll('wait');
        this.bracket = new Bracket(this.players);
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
            this.changeScene('Results');
        });
        this.changeScene('Collection');
    }

    public startRematches() {
        const round = this.bracket.getCurrentRound();
        round.startRematches().then(() => {
            this.changeScene('Results');
        });
        this.changeScene('Collection');
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
        host.on('join-request', (request: JoinRequest, data: { [key: string]: any }) => {
            const name = data['name'];
            if (this.players.some(player => player.name === name)) {
                request.reject(`Player with name ${name} already in room`);
            } else {
                request.approve();
            }
        });

        host.once('joined', (user: User) => {
            user.send('vip');
            user.once('start', () => {
                this.start();
            });
        });

        host.on('joined', (user: User) => {
            const player = new Player(user);
            this.players.push(player);
            this.emit('joined', player);
        });
    }

    static init(game: Game) {
        RockOff.singleton = new RockOff(game);
        RockOff.singleton.startLobby();
    }

    static get(): RockOff {
        return RockOff.singleton;
    }
}
