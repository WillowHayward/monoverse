import * as Phaser from 'phaser';
import { MenuScene } from './scenes/menu';
import { LobbyScene } from './scenes/lobby';

const width = window.outerWidth;
const height = window.outerHeight;

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width,
    height,
    backgroundColor: '#ADD8E6',
    scene: [MenuScene, LobbyScene]
};

const game = new Phaser.Game(config);
