import * as Phaser from 'phaser';

const width = window.outerWidth;
const height = window.outerHeight;

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width,
    height,
};

const game = new Phaser.Game(config);
