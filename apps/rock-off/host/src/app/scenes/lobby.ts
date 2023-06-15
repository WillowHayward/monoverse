import { Scene } from "./scene";

export class LobbyScene extends Scene {
    constructor() {
        super({key: 'Lobby'});
    }

    preload() {
        super.preload();
    }

    create() {
        let y = 20;
        const header = this.add.text(this.width / 2, y, 'Lobby', {
            align: 'center',
            fontFamily: 'arial',
            fontSize: '20vh',
            color: 'black'
        });
        header.x -= header.displayWidth / 2;
    }
}

