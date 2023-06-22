import { GameObjects, Scene, Types } from "phaser";
import { BUTTON_KEYS } from "./enums";

export class Button extends GameObjects.Container {
    private textObject: GameObjects.Text;
    private nineSlice: GameObjects.NineSlice;
    constructor(scene: Scene, x: number, y: number, text: string, style: Types.GameObjects.Text.TextStyle = {}) {
        style = {
            fontFamily: 'arial',
            fontSize: '10vh',
            color: 'black',
            ...style
        }
        super(scene, x, y);
        const textObject = new GameObjects.Text(scene, 0, 0, text, style);
        textObject.setOrigin(0.5, 0.5);

        const border = 10;
        const width = textObject.width + border * 2;
        const height = textObject.displayHeight + border * 2;
        const defaultTexture = scene.textures.get(BUTTON_KEYS.DEFAULT);
        const sideWidth = defaultTexture.getSourceImage().width / 3;
        const sideHeight = defaultTexture.getSourceImage().height / 3;
        const nineSlice = new GameObjects.NineSlice(scene, 0, 0, BUTTON_KEYS.DEFAULT, 0, width, height, sideWidth, sideWidth, sideHeight, sideHeight);
        //nineSlice.setSize(, );
        console.log(nineSlice.width, nineSlice.height, nineSlice.displayWidth, nineSlice.displayHeight);
        

        this.setSize(nineSlice.displayWidth, nineSlice.displayHeight);

        this.add(nineSlice);
        this.add(textObject);

        this.textObject = textObject;
        this.nineSlice = nineSlice;

        this.setInteractive()
            .on('pointerover', this.pointerOver)
            .on('pointerout', this.pointerOut)
            .on('pointerdown', this.pointerDown)
            .on('pointerup', this.pointerUp);
    }

    private pointerOver() {
        this.nineSlice.setTexture(BUTTON_KEYS.HOVER);
        this.textObject.setStyle({
            color: 'gray'
        });
    }

    private pointerOut() {
        this.nineSlice.setTexture(BUTTON_KEYS.DEFAULT);
        this.textObject.setStyle({
            color: 'black'
        });
    }

    private pointerDown() {
        this.nineSlice.setTexture(BUTTON_KEYS.PRESSED);
    }

    private pointerUp() {
        this.nineSlice.setTexture(BUTTON_KEYS.DEFAULT);
        this.emit('click');
    }
}

