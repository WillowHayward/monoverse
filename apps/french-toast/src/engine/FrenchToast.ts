import { Player } from './Player'
import { Game } from './Game'
import { LocalClient } from './LocalClient'
import { LocalUser } from './LocalUser'

export class FrenchToast {
  private decks;
  private server: string;
  constructor(server: string) {
    this.decks = this.loadDecks();
    this.server = server;

    const scaleHints = document.getElementsByClassName('scaleHintImgContainer');
    for(let i = 0; i < scaleHints.length; i++) {
      const scale = scaleHints.item(i);
      const scaleHintImgList = scale.getElementsByClassName('hint')
      const scaleHintImg = <HTMLElement> scaleHintImgList.item(0);
      scaleHintImg.style.paddingTop = '25px';
    }

    const hostName = document.getElementById('txtNameHost');
    hostName.onchange = this.checkHost;
    hostName.oninput = this.checkHost;
    hostName.onpaste = this.checkHost;
    hostName.onkeypress = this.checkHost;
    
    const clientName = document.getElementById('txtNameClient');
    clientName.onchange = this.checkClient;
    clientName.oninput = this.checkClient;
    clientName.onpaste = this.checkClient;
    clientName.onkeypress = this.checkClient;

    const txtCode = document.getElementById('txtCode');
    txtCode.onchange = this.checkClient;
    txtCode.oninput = this.checkClient;
    txtCode.onpaste = this.checkClient;
    txtCode.onkeypress = this.checkClient;

    document.getElementById('btnHost').onclick = this.hostGame.bind(this);
    document.getElementById('btnJoin').onclick = this.joinGame.bind(this);
  }

  private hostGame() {
    const lw = Lipwig.create(this.server);
    lw.host = true;

    document.getElementById('menu').classList.add('hidden');
    document.getElementById('loading').classList.remove('hidden');
    lw.on('created', (code) => {
      const game = new Game(lw, this.decks);
      document.getElementById('btnStart').classList.remove('hidden');

      const client = new LocalClient(lw);
      const localUser = new LocalUser(client, lw)
      client.user = localUser;

      const nameElement =<HTMLInputElement> document.getElementById('txtNameHost');
      const name = nameElement.value;
      const player = new Player(true, client, name, code);
      player.game = game;
    });
  }

  private joinGame() {
    const codeElement = <HTMLInputElement> document.getElementById('txtCode');
    const code = codeElement.value.toUpperCase();
    const nameElement = <HTMLInputElement> document.getElementById('txtNameClient');
    const name = nameElement.value;

    const lw = Lipwig.join(this.server, code, {
      'name': name
    });
    lw.host = false;

    document.getElementById('menu').classList.add('hidden');
    document.getElementById('loading').classList.remove('hidden');

    lw.on('joined', () => {
      console.log(lw.id);
      new Player(false, lw, name, code);
    });

    lw.on('error', () => {
      alert('Error joining room - check room code and try again');
      document.getElementById('loading').classList.add('hidden');
      document.getElementById('menu').classList.remove('hidden');
    });
  }

  private checkHost() {
    const btnHost = <HTMLInputElement> document.getElementById('btnHost');
    btnHost.disabled = btnHost.value.length == 0;
  }

  private checkClient() {
    const code = (<HTMLInputElement>document.getElementById('txtCode')).value;
    const name = (<HTMLInputElement>document.getElementById('txtNameClient')).value;
    const btn = (<HTMLInputElement>document.getElementById('btnJoin'));
    btn.disabled = (code.length != 4 || name.length == 0);
  }

  private loadDecks(): any {
    const hints = document.getElementsByClassName('hint');
    for (let i = 0; i < hints.length; i++) {
      let hint = <HTMLImageElement>hints.item(i);
      hint.src = 'assets/scale.png';
    }

    const deck = {
      hint: new JSDeck(),
      basic: new JSDeck(),
      advanced: new JSDeck()
    }

    const basicDeckSize = 53;
    const advancedDeckSize = 48;
    const hintDeckSize = 36;
    let src: string;
    for (let i = 0; i < basicDeckSize; i++) {
      if (i < hintDeckSize) {
        let hint = new Image();
        src = 'assets/hints/hint' + i + '.png';
        hint.src = src;
        deck.hint.add(hint);
      }

      let basicWord = new Image();
      src = 'assets/basic/word' + i + '.png';
      basicWord.src = src;
      deck.basic.add(basicWord);

      if (i < advancedDeckSize) {
        let advancedWord = new Image();
        src = 'assets/advanced/word' + i + '.png';
        advancedWord.src = src;
        deck.advanced.add(advancedWord);
      }
    }
    
    deck.hint.shuffle();
    deck.basic.shuffle();
    deck.advanced.shuffle();

    return deck;
  }
}
