import { Scene as PhaserScene } from 'phaser';

export abstract class Scene extends PhaserScene {
    protected canvas: HTMLCanvasElement;
    protected width: number;
    protected height: number;

    preload() {
        this.canvas = this.game.canvas;

        const { width, height } = this.canvas;
        this.width = width;
        this.height = height;
    }

}

