import { Game, Events } from 'phaser';
import { Host, JoinRequest, Lipwig, User } from '@lipwig/js';

import { Bracket } from './bracket';
import { Contestant, Player } from './contestants';
import { Round } from './round';
import { GAME_STATE, SceneKeys } from '../game.model';

const LIPWIG_URL = 'wss://lipwig-next.whc.fyi';
//const LIPWIG_URL = 'ws://localhost:8989';

export class RockOff extends Events.EventEmitter {
    private static singleton: RockOff;
    private state: GAME_STATE;
    private players: Player[] = [];
    private bracket: Bracket;
    private winner: Contestant;
    public host: Host;

    private constructor(public game: Game) {
        super();
        this.setState(GAME_STATE.LOADING);
        this.startLobby();
    }

    public startLobby() {
        Lipwig.create(LIPWIG_URL, {
            name: 'rock-off',
            approvals: true,
        }).then(host => {
            this.setHost(host);
            this.setState(GAME_STATE.LOBBY);
        })
    }

    public startIntro() {
        this.host.lock('Game In Progress');
        this.host.sendToAll('wait');

        this.setState(GAME_STATE.INTRO);
    }

    public startGame() {
        this.bracket = new Bracket(this.players);
        this.bracket.nextRound()

        this.setState(GAME_STATE.BRACKET);
    }

    public nextRound() {
        if (this.bracket.getCurrentRound().getWinners().length === 1) {
            this.winner = this.bracket.getCurrentRound().getWinners().pop();
            this.setState(GAME_STATE.WINNER);
            return;
        }
        this.bracket.nextRound();
        this.setState(GAME_STATE.BRACKET);
    }

    public startRound() {
        const round = this.bracket.getCurrentRound();
        round.start().then(() => {
            this.setState(GAME_STATE.RESULT);
        });
        this.setState(GAME_STATE.COLLECTION); // TODO: Add matchup here
    }

    public startRematches() {
        const round = this.bracket.getCurrentRound();
        round.startRematches().then(() => {
            this.setState(GAME_STATE.RESULT);
        });
        this.setState(GAME_STATE.COLLECTION);
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

    private setState(state: GAME_STATE) {
        if (this.state !== undefined) {
            this.game.scene.stop(SceneKeys[this.state]);
        }
        this.state = state;
        this.game.scene.start(SceneKeys[this.state]);
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
                this.startGame();
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
        RockOff.singleton.game.scene.stop('Menu');
    }

    static get(): RockOff {
        return RockOff.singleton;
    }
}
