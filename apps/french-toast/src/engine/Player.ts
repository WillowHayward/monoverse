import { Game } from './Game';
import { GameState } from './GameState';

export class Player {
    private index: number;
    private hintBegun: boolean;

    private timerInterval;
    private timerCount = 0;
    private timerOffset = 0;
    private waiting: boolean = false;
    private client;
    private isToastmaster: boolean;

    private isHost: boolean;

    private currentPage: string = 'loading';
    private team;

    public game: Game = null;

    constructor(isHost, client, name, code) {
        this.isHost = isHost;
        this.client = client;

        this.setUserHandlers();

        if (this.isHost) {
            this.sendToHost('joined', this.client.user);
        }

        document.getElementById('codeContainer').classList.remove('hidden');
        document.getElementById('code').innerText = code;

        this.sendToHost('setName', name);
        this.assignToastmaster(this.isHost);

        this.showPage('lobby');
        this.registerHTMLListeners();
    }

    private setSettings(deck, timer, mode): void {
        const settings = {
            deck: deck,
            timer: timer,
            mode: mode,
        };

        this.sendToHost('setSettings', settings);
    }

    public registerHTMLListeners(): void {
        document.getElementById('btnStart').onclick = () => {
            this.sendToHost('start');
        };

        document.getElementById('btnChangeToTeams').onclick = () => {
            this.setSettings(null, null, 'teams');
        };

        document.getElementById('btnChangeToCoop').onclick = () => {
            this.setSettings(null, null, 'coop');
        };

        const deckOptionRadios = document.getElementsByName('deckOptions');
        for (let i = 0; i < deckOptionRadios.length; i++) {
            const deckOptionRadio = deckOptionRadios.item(i);
            deckOptionRadio.onchange = () => {
                const deckQuery = "input[name='deckOptions']:checked";
                const deckElement = <HTMLInputElement>(
                    document.querySelector(deckQuery)
                );
                const deck = deckElement.value;
                this.setSettings(deck, null, null);
            };
        }

        const timerQuery = 'chkTimer';
        const timerElement = <HTMLInputElement>(
            document.getElementById(timerQuery)
        );
        timerElement.onclick = () => {
            const timer = timerElement.checked;
            this.setSettings(null, timer, null);
        };

        document.getElementById('btnCommitHints').onclick = () => {
            const scale = this.getScale();
            this.sendToAll('scale', scale);
            this.sendToHost('scale', scale);
            this.sendToHost('advanceRound');
        };

        document.getElementById('btnStartGuessing').onclick = () => {
            this.sendToHost('advanceRound');
        };

        document.getElementById('btnEndGuessing').onclick = () => {
            this.sendToHost('advanceRound');
        };

        document.getElementById('btnPickWinner').onclick = () => {
            const ul = document.getElementById('ulWinnerList');
            if (ul.classList.contains('hidden')) {
                ul.classList.remove('hidden');
            } else {
                ul.classList.add('hidden');
            }
        };

        document.getElementById('btnJoinTeamOne').onclick = () => {
            this.setTeam(0);
        };

        document.getElementById('btnJoinTeamTwo').onclick = () => {
            this.setTeam(1);
        };

        document.getElementById('btnJoinTeamOneLate').onclick = () => {
            this.setTeam(0);
            this.showPage('game');
        };

        document.getElementById('btnJoinTeamTwoLate').onclick = () => {
            this.setTeam(1);
            this.showPage('game');
        };

        document.getElementById('btnPlayAgain').onclick = () => {
            this.showPage('lobby');
        };

        const pointButtons = document.getElementsByClassName('btnPoint');
        for (let i = 0; i < pointButtons.length; i++) {
            const pointButton = <HTMLInputElement>pointButtons.item(i);
            pointButton.onclick = (evt) => {
                const target = pointButton.name;
                this.sendToAll('point', target);
            };
        }

        const unpointButtons = document.getElementsByClassName('btnUnpoint');
        for (let i = 0; i < unpointButtons.length; i++) {
            const unpointButton = <HTMLInputElement>unpointButtons.item(i);
            unpointButton.onclick = () => {
                this.sendToAll('point', '');
            };
        }
    }

    public listPlayers(names, target, list, toastmaster): void {
        const ul = document.getElementById(target);
        ul.innerHTML = '';
        for (let i = 0; i < names.length; i++) {
            const userListItem = document.createElement('div');
            userListItem.classList.add('lobbyUser');
            userListItem.innerText = names[i];
            ul.appendChild(userListItem);

            if (list != 'unassigned') {
                const teamNames = ['teamOne', 'teamTwo'];
                let sameTeam = teamNames[this.team] == list;
                if (list == 'players') {
                    sameTeam = true;
                }

                if (i == toastmaster) {
                    const toastmasterLogo = document.createElement('img');
                    toastmasterLogo.src = 'assets/toast.png';
                    toastmasterLogo.classList.add('toastmasterLogo');

                    userListItem.appendChild(toastmasterLogo);
                } else if (this.isToastmaster && sameTeam) {
                    /*const kickButton = document.createElement('input');
          kickButton.type = 'button';
          kickButton.value = 'Kick';
          kickButton.classList.add('toastmasterButton');
          kickButton.onclick = () => {
            this.sendToHost('kickUser', {
              team: list,
              index: i
            });
          } 
          userListItem.prepend(kickButton);*/

                    const toastmasterButton = document.createElement('input');
                    toastmasterButton.type = 'button';
                    toastmasterButton.value = 'Promote';
                    toastmasterButton.classList.add('toastmasterButton');
                    toastmasterButton.onclick = () => {
                        this.sendToHost('setToastmaster', {
                            team: list,
                            index: i,
                        });
                    };
                    userListItem.appendChild(toastmasterButton);
                }
            }
        }
    }

    public makeWinnerList(names): void {
        const ul = document.getElementById('ulWinnerList');
        ul.innerHTML = '';
        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            const userButton = document.createElement('input');
            userButton.type = 'button';
            userButton.value = name;
            userButton.onclick = () => {
                clearInterval(this.timerInterval);
                this.sendToHost('winner', i);
            };
            const li = document.createElement('li');
            li.appendChild(userButton);
            ul.appendChild(li);
        }
    }

    private setTeam(team: number) {
        this.team = team;
        this.sendToHost('setTeam', team);
    }

    private setDragHandlers(target): void {
        const hintDragStart = (evt) => {
            let origin = evt.target.getAttribute('data-origin');
            let src = evt.target.src;
            evt.dataTransfer.setData('origin', origin);
            evt.dataTransfer.setData('src', src);
            target.name = 'dragging';
        };

        const hintDragOver = (evt) => {
            evt.preventDefault();
        };

        const hintDragDrop = (evt) => {
            evt.preventDefault();
            const startOrigin = evt.dataTransfer.getData('origin');
            const startSrc = evt.dataTransfer.getData('src');
            const endOrigin = evt.target.getAttribute('data-origin');
            const endSrc = evt.target.src;
            const other = <HTMLImageElement>(
                document.getElementsByName('dragging').item(0)
            );
            other.name = null;

            if (target.parentElement.id == 'handContainer') {
                if (startOrigin == 'scale') {
                    return;
                }
            }

            if (startOrigin == 'hand') {
                if (target.src.split('/').pop() != 'scale.png') {
                    if (endOrigin != 'hand') {
                        return;
                    }
                }
            }

            target.src = startSrc;
            target.setAttribute('data-origin', startOrigin);
            other.src = endSrc;
            other.setAttribute('data-origin', endOrigin);
            this.validateHints();
        };
        target.ondragstart = hintDragStart;
        target.ondragover = hintDragOver;
        target.ondrop = hintDragDrop;
    }

    public validateHints(): void {
        const scale = document.getElementsByClassName('scale');
        let handCards = 0;
        for (let i = 0; i < scale.length; i++) {
            const hint = scale.item(i);
            if (hint.getAttribute('data-origin') == 'hand') {
                handCards++;
            }
        }
        let disable = true;
        const error = document.getElementById('hintsError');
        if (handCards < 1) {
            error.innerText = 'Drag A Card From Your Hand Onto The Scale';
        } else if (handCards > 1) {
            error.innerText =
                'You can only play one card from your hand each round';
        } else {
            error.innerText = '';
            disable = false;
        }

        const button = <HTMLInputElement>(
            document.getElementById('btnCommitHints')
        );
        button.disabled = disable;
    }

    public getScale(): any[] {
        const hints = [];
        const scale = document.getElementsByClassName('scale');
        for (let i = 0; i < scale.length; i++) {
            const hint = <HTMLImageElement>scale.item(i);
            let hintSrc = hint.src.split('/').pop();
            if (hintSrc == 'scale.png') {
                hintSrc = '';
            }
            hints[i] = hintSrc;
        }
        return hints;
    }

    public startTimer(): void {
        console.log('Start Timer');
        this.timerCount = 30;

        const timer = document.getElementById('timerDisplay');
        timer.classList.remove('hidden');
        timer.innerText = Number(this.timerCount).toString();

        this.timerInterval = setInterval(() => {
            this.tick();
        }, 1000);
    }

    public tick(): void {
        this.timerCount--;
        document.getElementById('timerDisplay').innerText = Number(
            this.timerCount
        ).toString();
        if (this.timerCount == 0) {
            clearInterval(this.timerInterval);
            if (this.isToastmaster) {
                if (!this.waiting) {
                    this.sendToHost('advanceRound');
                }
                //this.sendToAll('stopTimer');
            } else {
                document.getElementById('guessStage').classList.add('hidden');
            }
        }
    }

    private stopTimerUserHandler() {
        clearInterval(this.timerInterval);
        document.getElementById('timerDisplay').classList.add('hidden');
    }

    public setOffset(offset): void {
        this.timerOffset = offset;
    }

    setUserHandlers(): void {
        const keys = Object.keys(this.client.events);
        for (let i = 0; i < keys.length; i++) {
            this.client.clear(keys[i]);
        }
        this.client.on('pong', this.pongUserHandler.bind(this));
        this.client.on('gameState', this.renderGame.bind(this));
        this.client.on('start', this.startUserHandler.bind(this));
        this.client.on('scale', this.scaleUserHandler.bind(this));
        this.client.on('timer', this.startTimer.bind(this));
        this.client.on('point', this.point.bind(this));

        this.client.on('end', this.resetGame.bind(this));

        this.client.on('stopTimer', this.stopTimerUserHandler.bind(this));

        this.client.on('word', this.wordUserHandler.bind(this));
        this.client.on('assignToastmaster', this.assignToastmaster.bind(this));
        this.client.on('updatedWinners', this.makeWinnerList.bind(this));

        this.client.on('index', (index) => {
            this.index = index;
        });

        this.client.on('lateArrival', (state) => {
            this.renderGame(state);
            if (state.mode == 'coop') {
                this.showPage('game');
            } else {
                this.showPage('lateArrival');
                const teamOneLabel = state.teams.names[0];
                const teamOneBtn = <HTMLInputElement>(
                    document.getElementById('btnJoinTeamOneLate')
                );
                teamOneBtn.value = teamOneLabel;

                const teamTwoLabel = state.teams.names[1];
                const teamTwoBtn = <HTMLInputElement>(
                    document.getElementById('btnJoinTeamTwoLate')
                );
                teamTwoBtn.value = teamTwoLabel;
            }
        });

        this.client.on('kicked', (reason) => {
            if (!this.isHost) {
                alert(reason);
                location.reload();
            }
        });
    }

    public pongUserHandler(then): void {
        const now = new Date().getTime();
        const ping = now - then;
    }

    public startUserHandler(): void {
        const emptyScale = ['', '', '', '', '', ''];
        this.scaleUserHandler(emptyScale);
        this.showPage('game');
    }

    public scaleUserHandler(scale): void {
        const myScale = document.getElementsByClassName('scale');
        for (let i = 0; i < myScale.length; i++) {
            let hint = <HTMLImageElement>myScale.item(i);
            let file = 'hints/';
            if (scale[i].length == 0) {
                file = 'scale.png';
            } else {
                file += scale[i];
            }
            hint.src = 'assets/' + file;
        }
    }

    public wordUserHandler(word): void {
        (<HTMLImageElement>document.getElementById('word')).src = word;
        this.showPage('game');
    }

    public assignToastmaster(amNowToastmaster): void {
        this.isToastmaster = amNowToastmaster;

        let remove: string;
        let add: string;
        if (this.isToastmaster) {
            remove = 'toastmaster';
            add = 'toastmasterVisible';

            const hostElements =
                document.getElementsByClassName('clientVisible');
            if (hostElements.length > 0) {
                while (hostElements.length > 0) {
                    const hostElement = hostElements.item(0);
                    hostElement.classList.remove('clientVisible');
                    hostElement.classList.add('client');
                }
            }
        } else {
            remove = 'toastmasterVisible';
            add = 'toastmaster';

            const hostElements = document.getElementsByClassName('client');
            if (hostElements.length > 0) {
                while (hostElements.length > 0) {
                    const hostElement = hostElements.item(0);
                    hostElement.classList.add('clientVisible');
                    hostElement.classList.remove('client');
                }
            }
        }

        const toastmasterElements = document.getElementsByClassName(remove);
        if (toastmasterElements.length > 0) {
            while (toastmasterElements.length > 0) {
                const toast = toastmasterElements.item(0);
                toast.classList.remove(remove);
                toast.classList.add(add);
            }
        }

        const hints = document.getElementsByClassName('hint');
        for (let i = 0; i < hints.length; i++) {
            const hint = <HTMLElement>hints.item(i);
            if (this.isToastmaster) {
                this.setDragHandlers(hint);
            } else {
                hint.ondragstart = null;
                hint.ondragover = null;
                hint.ondrop = null;
            }
        }
    }

    private resetGame(state: GameState): void {
        this.hintBegun = false;
        this.renderGame(state);

        document.getElementById('ulWinnerList').classList.add('hidden');

        const hints = document.getElementsByClassName('hint');
        for (let i = 0; i < hints.length; i++) {
            const hint = <HTMLElement>hints.item(i);
            hint.ondragstart = null;
            hint.ondragover = null;
            hint.ondrop = null;
        }

        const word = state.word;
        (<HTMLImageElement>document.getElementById('endScreenWord')).src = word;

        const winner = state.winner;
        if (winner < 0) {
            document.getElementById('allLose').classList.remove('hidden');
            document.getElementById('allWin').classList.add('hidden');
        } else {
            document.getElementById('allWin').classList.remove('hidden');
            document.getElementById('allLose').classList.add('hidden');
            document.getElementById('coopWinnerName').innerText = winner;
            if (state.mode == 'coop') {
            } else {
            }
        }

        this.showPage('endScreen');
    }

    public renderGame(game: GameState): void {
        if (game.stage == -1) {
            this.renderLobby(game);
            return;
        }

        if (!this.hintBegun) {
            this.scaleUserHandler(game.scale);
        }

        switch (game.stage) {
            case 0: // Hint
                this.renderHintStage(game);
                break;
            case 1: // Discuss
                this.renderDiscussStage(game);
                break;
            case 2: // Guess
                this.renderGuessStage(game);
                break;
        }

        if (game.stage >= 0) {
            if (this.isToastmaster) {
                this.makeWinnerList(game.winners);
            }
        }

        if (game.stage != 2) {
            clearInterval(this.timerInterval);
            document.getElementById('timerDisplay').classList.add('hidden');
        }

        if (game.mode == 'teams') {
            this.setWait(game);
        } else {
            this.waiting = false;
        }
    }

    public setWait(game: GameState): void {
        console.log('WAITING');
        this.waiting = this.team != game.currentTeam;

        if (this.waiting) {
            const elementsToHide = [
                'hintsStage',
                'discussStage',
                'btnEndGuessing',
                'handContainer',
            ];
            for (let i = 0; i < elementsToHide.length; i++) {
                const elmt = document.getElementById(elementsToHide[i]);
                elmt.classList.add('hidden');
            }
        }
    }

    public renderLobby(game: GameState): void {
        if (this.currentPage != 'endScreen') {
            this.showPage('lobby');
        }

        let modeDisplayText: string;
        if (game.mode == 'coop') {
            document
                .getElementById('teamOneListContainer')
                .classList.add('hidden');
            document
                .getElementById('teamTwoListContainer')
                .classList.add('hidden');

            modeDisplayText = 'Cooperative';
            const userListContainer =
                document.getElementById('userListContainer');
            userListContainer.classList.remove('userListFloat');
            this.listPlayers(
                game.players,
                'userList',
                'players',
                game.toastmaster
            );

            document.getElementById('btnChangeToCoop').classList.add('hidden');
            document
                .getElementById('btnChangeToTeams')
                .classList.remove('hidden');

            this.team = -1;
        } else {
            modeDisplayText = 'Teams';
            document
                .getElementById('teamOneListContainer')
                .classList.remove('hidden');
            document
                .getElementById('teamTwoListContainer')
                .classList.remove('hidden');
            this.listPlayers(
                game.teams.unassigned,
                'userList',
                'unassigned',
                null
            );

            this.listPlayers(
                game.teams.team[0],
                'teamOneList',
                'teamOne',
                game.teams.toastmasters[0]
            );
            this.listPlayers(
                game.teams.team[1],
                'teamTwoList',
                'teamTwo',
                game.teams.toastmasters[1]
            );

            document.getElementById('btnChangeToTeams').classList.add('hidden');
            document
                .getElementById('btnChangeToCoop')
                .classList.remove('hidden');

            const joinTeamButtons =
                document.getElementsByClassName('btnJoinTeam');

            joinTeamButtons.item(0).classList.remove('hidden');
            joinTeamButtons.item(1).classList.remove('hidden');

            if (this.team == 0) {
                const joinTeamButton =
                    document.getElementById('btnJoinTeamOne');
                joinTeamButton.classList.add('hidden');
            } else if (this.team == 1) {
                const joinTeamButton =
                    document.getElementById('btnJoinTeamTwo');
                joinTeamButton.classList.add('hidden');
            }
        }

        const modeDisplays = document.getElementsByClassName('displayMode');
        for (let i = 0; i < modeDisplays.length; i++) {
            const modeDisplay = <HTMLElement>modeDisplays.item(i);
            modeDisplay.innerText = modeDisplayText;
        }

        const deckDisplay = document.getElementById('displayDeck');
        if (game.deck == 'basic') {
            deckDisplay.innerText = 'Basic Deck';

            if (this.isToastmaster) {
                let deckQuery = 'rdDeckBasic';
                let deckElement = <HTMLInputElement>(
                    document.getElementById(deckQuery)
                );
                deckElement.checked = true;
                deckQuery = 'rdDeckAdvanced';
                deckElement = <HTMLInputElement>(
                    document.getElementById(deckQuery)
                );
                deckElement.checked = false;
            }
        } else {
            deckDisplay.innerText = 'Advanced Deck';

            if (this.isToastmaster) {
                let deckQuery = 'rdDeckAdvanced';
                let deckElement = <HTMLInputElement>(
                    document.getElementById(deckQuery)
                );
                deckElement.checked = true;
                deckQuery = 'rdDeckBasic';
                deckElement = <HTMLInputElement>(
                    document.getElementById(deckQuery)
                );
                deckElement.checked = false;
            }
        }

        const timerDisplay = document.getElementById('displayTimer');
        if (game.timer) {
            timerDisplay.innerText = 'Use Timer';
            if (this.isToastmaster) {
                let deckQuery = 'chkTimer';
                let deckElement = <HTMLInputElement>(
                    document.getElementById(deckQuery)
                );
                deckElement.checked = true;
            }
        } else {
            timerDisplay.innerText = 'Do Not User Timer';
            if (this.isToastmaster) {
                let deckQuery = 'chkTimer';
                let deckElement = <HTMLInputElement>(
                    document.getElementById(deckQuery)
                );
                deckElement.checked = false;
            }
        }

        const btnStart = <HTMLInputElement>document.getElementById('btnStart');
        btnStart.disabled = !game.canStart;
    }

    public renderHintStage(game: GameState): void {
        if (this.hintBegun) {
            return;
        }
        this.hintBegun = true;

        document.getElementById('hintsStage').classList.remove('hidden');
        document.getElementById('handContainer').classList.remove('hidden');

        document.getElementById('guessStage').classList.add('hidden');
        document.getElementById('discussStage').classList.add('hidden');

        const hand = document.getElementsByClassName('hand');
        for (let i = 0; i < hand.length; i++) {
            const hint = <HTMLImageElement>hand.item(i);
            hint.src = game.hints[i];
            hint.setAttribute('data-origin', 'hand');
            hint.draggable = true;
        }

        const scale = document.getElementsByClassName('scale');
        for (let i = 0; i < scale.length; i++) {
            const hint = <HTMLImageElement>scale.item(i);
            hint.setAttribute('data-origin', 'scale');
            hint.draggable = true;
        }
        this.validateHints();
    }

    public renderDiscussStage(game: GameState): void {
        this.hintBegun = false;
        document.getElementById('discussStage').classList.remove('hidden');

        document.getElementById('hintsStage').classList.add('hidden');
        document.getElementById('handContainer').classList.add('hidden');

        if (game.timer) {
            document.getElementById('timerDisplay').classList.remove('hidden');
            if (this.isToastmaster) {
                document
                    .getElementById('btnEndGuessing')
                    .classList.add('hidden');
            }
        } else {
            if (this.isToastmaster) {
                document
                    .getElementById('btnEndGuessing')
                    .classList.remove('hidden');
            }
        }

        const hints = document.getElementsByClassName('hint');
        for (let i = 0; i < hints.length; i++) {
            const hint = <HTMLImageElement>hints.item(i);
            hint.removeAttribute('data-origin');
            hint.draggable = false;
        }
    }

    public renderGuessStage(game: GameState): void {
        document.getElementById('guessStage').classList.remove('hidden');

        document.getElementById('discussStage').classList.add('hidden');
        document.getElementById('hintsStage').classList.add('hidden');
        document.getElementById('handContainer').classList.add('hidden');
    }

    public point(name): void {
        this.unpoint();
        if (name == '') {
            return;
        }

        const targetButton = document.getElementsByName(name).item(0);
        targetButton.classList.add('hidden');

        let container = targetButton.parentElement;
        const btnUnpoint = container
            .getElementsByClassName('btnUnpoint')
            .item(0);
        btnUnpoint.classList.remove('hidden');

        container = container.parentElement;
        const targetList = container.getElementsByClassName('pointer');
        const target = <HTMLImageElement>targetList.item(0);
        target.classList.remove('hidden');
        target.name = 'pointed';

        const scaleHintImgList = container.getElementsByClassName('hint');
        const scaleHintImg = <HTMLElement>scaleHintImgList.item(0);
        scaleHintImg.style.paddingTop = '0';
    }

    public unpoint(): void {
        const target = <HTMLImageElement>(
            document.getElementsByName('pointed').item(0)
        );
        if (target == null) {
            return;
        }

        target.name = null;
        target.classList.add('hidden');
        let container = target.parentElement.parentElement;
        const button = container.getElementsByClassName('btnPoint').item(0);
        button.classList.remove('hidden');

        const unpointButtonList =
            container.getElementsByClassName('btnUnpoint');
        const unpointButton = unpointButtonList.item(0);
        unpointButton.classList.add('hidden');

        const scaleHintImgList = container.getElementsByClassName('hint');
        const scaleHintImg = <HTMLElement>scaleHintImgList.item(0);
        scaleHintImg.style.paddingTop = '25px';
    }

    public showPage(page): void {
        document.getElementById(this.currentPage).classList.add('hidden');
        this.currentPage = page;
        document.getElementById(this.currentPage).classList.remove('hidden');
    }

    public sendToAll(evt, data?): void {
        this.sendToHost('relay', [evt, data]);
    }

    public sendToHost(evt, data?): void {
        this.client.send(evt, data);
    }
}
