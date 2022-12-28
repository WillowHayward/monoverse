import { GameState } from './GameState';

export class Game {
    private host;
    private decks;
    private stages = ['hint', 'discuss', 'guess'];
    private users = [];

    private scale = ['', '', '', '', '', ''];
    private hints = [];
    private stage = -1; // Lobby
    private currentTeam = 0;
    private currentToastmaster = 0;
    private teams = {
        unassigned: [],
        team: [[], []],
        toastmasters: [0, 0],
    };
    private word: string;

    private deck;
    private deckName;
    private mode = null;
    private timer;

    constructor(host, decks) {
        this.host = host;
        this.decks = decks;
        // Set default settings
        this.setSettings(null, {
            deck: 'basic',
            timer: true,
            mode: 'coop',
        });

        this.setHostListeners();
    }

    private setHostListeners() {
        this.host.on('joined', (user) => {
            this.addUser(user);
        });

        this.host.on('setName', (user, name) => {
            user.data = user.data || {};

            let prefix = name;
            let count = 0;
            for (let i = 0; i < this.users.length; i++) {
                const compareUser = this.users[i];
                if (compareUser.data.name == name) {
                    count++;
                    name = prefix + '(' + count + ')';
                }
            }
            console.log('New arrival! Stage: ');
            console.log(this.stage);

            user.data.name = name;
            if (this.stage >= 0) {
                const state = this.getState();

                if (this.mode == 'teams') {
                    this.teams.unassigned.push(user);
                    state.teams.names = [];
                    for (let i = 0; i < this.teams.toastmasters.length; i++) {
                        const toastmasterIndex = this.teams.toastmasters[i];
                        const toastmaster =
                            this.teams.team[i][toastmasterIndex];
                        const teamName = toastmaster.data.name + "'s team";
                        state.teams.names.push(teamName);
                    }
                }
                user.send('lateArrival', state);
            }
            const lobby = this.getState();
            this.sendToAll('gameState', lobby);
        });

        this.host.on('setToastmaster', (user, data) => {
            const team = data.team;
            const index = data.index;

            const swapPlayers = (arr, index, team) => {
                let current;
                if (team < 0) {
                    current = this.currentToastmaster;
                    this.currentToastmaster = index;
                } else {
                    current = this.teams.toastmasters[team];
                    this.teams.toastmasters[team] = index;
                }

                arr[current].send('assignToastmaster', false);
                arr[index].send('assignToastmaster', true);

                this.sendToAll('gameState', this.getState());
            };

            if (this.mode == 'coop') {
                swapPlayers(this.users, index, -1);
            } else {
                let teamIndex = 0;
                if (team == 'teamTwo') {
                    teamIndex++;
                }
                swapPlayers(this.teams.team[teamIndex], index, teamIndex);
            }
        });

        this.host.on('setSettings', (user, settings) => {
            this.setSettings(user, settings);
        });

        this.host.on('scale', (user, scale) => {
            this.scale = scale;
        });

        this.host.on('ping', (user, time) => {
            user.send('pong', time);
        });

        this.host.on('advanceRound', () => {
            this.advanceRound();
        });

        this.host.on('relay', (user, data) => {
            this.sendToAll(data[0], data[1]);
        });

        this.host.on('setTeam', (user, team) => {
            this.setTeam(user, team);
        });

        this.host.on('start', (user) => {
            this.start();
        });

        this.host.on('winner', (user, index) => {
            let winner;

            this.reset();
            if (this.mode == 'coop') {
                if (index >= this.currentToastmaster) {
                    index += 1;
                }

                const toastmaster = this.users[this.currentToastmaster];
                const newToastmaster = this.users[index];

                toastmaster.send('assignToastmaster', false);
                newToastmaster.send('assignToastmaster', true);

                this.currentToastmaster = index;
                winner = newToastmaster.data.name;
            } else {
                winner = this.getPotentialWinners()[index];
            }

            const state = this.getState();
            state.winner = winner;
            state.word = this.word;

            this.sendToAll('end', state);
        });

        this.host.on('kickUser', (user, data) => {
            const team = data.team;
            const index = data.index;
            let kickUser;

            if (this.mode == 'coop') {
                kickUser = this.users[index];
            } else {
                let teamIndex = 0;
                if (team == 'teamTwo') {
                    teamIndex++;
                }

                let teamArray;
                if (team == 'unassigned') {
                    teamArray = this.teams.unassigned;
                } else {
                    teamArray = this.teams.team[teamIndex];
                }

                kickUser = teamArray[index];

                if (!kickUser.isHost) {
                    const kickUserIndex = this.users.indexOf(kickUser);
                    teamArray.splice(kickUserIndex, 1);
                }
            }
            if (!kickUser.isHost) {
                const message = 'Kicked by ' + user.data.name;
                kickUser.send('kicked', message);
                const kickUserIndex = this.users.indexOf(kickUser);
                if (kickUserIndex > -1) {
                    this.users.splice(kickUserIndex, 1);
                }
                this.sendToAll('gameState', this.getState());
            }
        });
    }

    public addUser(user): void {
        const index = this.users.length;
        this.users.push(user);

        if (this.mode == 'teams') {
            this.teams.unassigned.push(user);
        }

        user.send('index', index);
    }

    public setSettings(user, settings): void {
        if (settings.deck != null) {
            this.deckName = settings.deck;
            switch (settings.deck) {
                case 'basic':
                    this.deck = this.decks.basic;
                    break;
                case 'advanced':
                    this.deck = this.decks.advanced;
                    break;
            }
        }

        if (settings.timer != null) {
            this.timer = settings.timer;
        }

        if (settings.mode != null) {
            if (this.mode != settings.mode) {
                if (settings.mode == 'coop') {
                    if (user != null) {
                        const newToastmasterIndex = this.users.indexOf(user);
                        this.currentToastmaster = newToastmasterIndex;
                    }

                    for (let i = 0; i < this.teams.toastmasters.length; i++) {
                        const toastmasterIndex = this.teams.toastmasters[i];
                        const toastmaster =
                            this.teams.team[i][toastmasterIndex];

                        if (toastmaster !== undefined) {
                            if (toastmaster != user) {
                                toastmaster.send('assignToastmaster', false);
                            }
                        }
                    }
                } else {
                    this.teams = {
                        unassigned: this.users.slice(),
                        team: [[], []],
                        toastmasters: [0, 0],
                    };

                    const toastmaster = this.users[this.currentToastmaster];
                    toastmaster.send('assignToastmaster', false);
                }
            }
            this.mode = settings.mode;
        }

        this.sendToAll('gameState', this.getState());
    }

    public canStart(): boolean {
        if (this.mode == 'coop') {
            return this.users.length > 1;
        } else {
            if (this.teams.unassigned.length > 0) {
                return false;
            }

            if (this.teams.team[0].length < 2) {
                return false;
            }

            if (this.teams.team[1].length < 2) {
                return false;
            }

            return true;
        }
    }

    public getUser(index): any {
        return this.users[index];
    }

    public getUsers(): any[] {
        return this.users.slice();
    }

    public getUserNames(): any[] {
        const names = [];
        for (let i = 0; i < this.users.length; i++) {
            const user = this.users[i];
            names.push(user.data.name);
        }
        return names;
    }

    public getTeamNames(): any {
        const names = {
            team: [[], []],
            unassigned: [],
        };

        for (let i = 0; i < this.teams.unassigned.length; i++) {
            const user = this.teams.unassigned[i];
            names.unassigned.push(user.data.name);
        }

        for (let i = 0; i < this.teams.team.length; i++) {
            for (let q = 0; q < this.teams.team[i].length; q++) {
                const user = this.teams.team[i][q];
                names.team[i].push(user.data.name);
            }
        }
        return names;
    }

    private removeA(arr, item) {
        var what,
            a = arguments,
            L = a.length,
            ax;
        while (L > 1 && arr.length) {
            what = a[--L];
            while ((ax = arr.indexOf(what)) !== -1) {
                arr.splice(ax, 1);
            }
        }
        return arr;
    }

    public setTeam(user, team): void {
        this.removeA(this.teams.unassigned, user);
        this.removeA(this.teams.team[0], user);
        this.removeA(this.teams.team[1], user);

        this.teams.team[team].push(user);
        if (this.teams.team[team].length == 1) {
            user.send('assignToastmaster', true);
            this.teams.toastmasters[team] = 0;
        } else {
            user.send('assignToastmaster', false);
        }

        const lobby = this.getState();
        this.sendToAll('gameState', lobby);
    }

    private getHintsSrc(): any[] {
        if (this.hints[0] == null) {
            return [];
        }

        const hintsSrc = [];
        for (let i = 0; i < this.hints.length; i++) {
            hintsSrc.push(this.hints[i].src);
        }

        return hintsSrc;
    }

    private getState(): GameState {
        const state: GameState = {
            timer: this.timer,
            mode: this.mode,
            deck: this.deckName,

            stage: this.stage,
            scale: this.scale,
            hints: this.getHintsSrc(),
            canStart: this.canStart(),
            toastmaster: this.currentToastmaster,
        };

        if (state.mode == 'coop') {
            state.players = this.getUserNames();
        } else {
            state.currentTeam = this.currentTeam;
            state.teams = this.getTeamNames();
            state.teams.toastmasters = this.teams.toastmasters;
        }

        if (state.stage >= 0) {
            state.winners = this.getPotentialWinners();
        }

        return state;
    }

    public getToastmaster(): any {
        if (this.mode == 'coop') {
            return this.users[this.currentToastmaster];
        } else {
            const toastmasterIndex = this.teams.toastmasters[this.currentTeam];
            return this.teams.team[this.currentTeam][toastmasterIndex];
        }
    }

    public getPlayers(): any {
        let players;
        if (this.mode == 'coop') {
            players = this.users.slice();
            players.splice(this.currentToastmaster, 1);
        } else {
            players = this.teams.unassigned.slice();
            for (let i = 0; i < this.teams.team.length; i++) {
                const team = this.teams.team[i].slice();
                const toastmaster = this.teams.toastmasters[i];
                team.splice(toastmaster, 1);
                players = players.concat(team);
            }
        }
        return players;
    }

    public start(): void {
        this.currentTeam = 0;
        if (this.mode == 'coop') {
        }

        this.sendToAll('start');
        this.word = this.deck.draw().src;
        this.sendToToastmasters('assignToastmaster', true);
        this.sendToPlayers('assignToastmaster', false);
        this.sendToToastmasters('word', this.word);
        this.advanceRound();
    }

    public reset(): void {
        this.scale = ['', '', '', '', '', ''];
        this.stage = -1; // Lobby
        this.decks.hint.shuffle(); //TODO: Add shuffle for other decks when they run out
        this.sendToAll('point', '');
    }

    public getPotentialWinners(): any[] {
        const winners = [];
        if (this.mode == 'coop') {
            for (let i = 0; i < this.users.length; i++) {
                if (i == this.currentToastmaster) {
                    continue;
                }

                const name = this.users[i].data.name;
                winners.push(name);
            }
        } else {
            for (let i = 0; i < this.teams.toastmasters.length; i++) {
                const toastmasterIndex = this.teams.toastmasters[i];
                const toastmaster = this.teams.team[i][toastmasterIndex];
                const teamName = toastmaster.data.name + "'s team";
                winners.push(teamName);
            }
        }
        return winners;
    }

    public advanceRound(): void {
        this.stage++;
        if (this.stage >= this.stages.length) {
            this.stage = 0;
            if (this.mode == 'teams') {
                this.currentTeam = 1 - this.currentTeam;
            }
        }

        const state = this.getState();

        switch (state.stage) {
            case 0: // Hint Stage
                this.hints = this.decks.hint.draw(6);
                if (this.hints[0] == null) {
                    // End of Deck
                    this.reset();
                    //const state = this.getState();
                    state.winner = -1;
                    state.word = this.word;

                    this.sendToAll('end', state);
                    return;
                }
                state.hints = this.getHintsSrc();
                break;

            case 1: // Discuss Stage
                break;

            case 2: // Guess Stage
                if (this.timer) {
                    this.sendToAll('timer');
                }
                break;
        }

        this.sendToPlayers('gameState', state);
        state.winners = this.getPotentialWinners();
        this.sendToToastmasters('gameState', state);
    }

    public sendToAll(evt, data?): void {
        const users = this.getUsers();
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            user.send(evt, data);
        }
    }

    public sendToCurrentToastmaster(evt, data?): void {
        const toastmasterIndex = this.teams.toastmasters[this.currentTeam];
        const toastmaster = this.teams.team[this.currentTeam][toastmasterIndex];
        toastmaster.send(evt, data);
    }

    public sendToWaitingToastmaster(evt, data?): void {
        const waitingTeam = 1 - this.currentTeam;
        const toastmasterIndex = this.teams.toastmasters[waitingTeam];
        const toastmaster = this.teams.team[waitingTeam][toastmasterIndex];
        toastmaster.send(evt, data);
    }

    public sendToToastmasters(evt, data?): void {
        if (this.mode == 'coop') {
            const toastmaster = this.getToastmaster();
            toastmaster.send(evt, data);
        } else {
            for (let i = 0; i < this.teams.toastmasters.length; i++) {
                const toastmasterIndex = this.teams.toastmasters[i];
                const toastmaster = this.teams.team[i][toastmasterIndex];
                toastmaster.send(evt, data);
            }
        }
    }

    public sendToPlayers(evt, data?): void {
        const players = this.getPlayers();
        for (let i = 0; i < players.length; i++) {
            const player = players[i];
            player.send(evt, data);
        }
    }
}
