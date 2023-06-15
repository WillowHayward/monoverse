import { Game } from "../game/game";
import { Button } from "../objects/button";
import { Scene } from "./scene";

export class MenuScene extends Scene {
    constructor() {
        super({key: 'Menu'});
    }

    preload() {
        super.preload();
    }

    create() {
        let y = 20;
        const header = this.add.text(this.width / 2, y, 'Rock Off', {
            align: 'center',
            fontFamily: 'arial',
            fontSize: '20vh',
            color: 'black'
        });
        header.x -= header.displayWidth / 2;

        y += header.displayHeight + 20;
        const btnCreate = new Button(this, this.width / 2, y , 'Create');
        btnCreate.on('click', () => {
            Game.init(this.game);
        });
        this.add.existing(btnCreate);
        y += btnCreate.displayHeight + 20;
        const btnCredits = new Button(this, this.width / 2, y, 'Credits');
        this.add.existing(btnCredits);
    }
}
