import { BUTTON_KEYS, Scene } from "@whc/phaser";
import { defaultTextStyle } from "../game.styles";

export class InitialScene extends Scene {
    preload(): void {
        super.preload();
        this.load.image(BUTTON_KEYS.DEFAULT, 'assets/button.png');
        this.load.image(BUTTON_KEYS.HOVER, 'assets/button.hover.png');
        this.load.image(BUTTON_KEYS.PRESSED, 'assets/button.pressed.png');
        const loadingText = this.add.text(this.width / 2, this.height / 2, '0% Loaded', defaultTextStyle);
        loadingText.setOrigin(0.5, 0.5);
        this.load.on('progress', (progress: number) => {
            const percentage = Math.round(progress * 100);
            loadingText.setText(`${percentage}% Loaded`);
        });
    }

    create(): void {
        this.scene.start('Menu');
    }
}
