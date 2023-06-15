import { GameObjects, Scene, Types } from "phaser";

export class Button extends GameObjects.Text {
    constructor(scene: Scene, x: number, y: number, text: string, style: Types.GameObjects.Text.TextStyle = {}) {
        style = {
            align: 'center',
            fontFamily: 'arial',
            fontSize: '10vh',
            color: 'black',
            ...style
        }
        super(scene, x, y, text, style);
        if (style.align === 'center') {
            this.x -= this.displayWidth / 2;
        }

        this.setInteractive()
            .on('pointerover', this.pointerOver)
            .on('pointerout', this.pointerOut)
            .on('pointerup', this.pointerUp);
    }

    private pointerOver() {
        this.setStyle({
            color: 'gray'
        });
    }

    private pointerOut() {
        this.setStyle({
            color: 'black'
        });
    }

    private pointerUp() {
        this.emit('click');
    }
}

