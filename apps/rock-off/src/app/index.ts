import * as Phaser from 'phaser';
import { InitialScene, MenuScene, LobbyScene, LoadingScene, BracketScene, ResultsScene, WinnerScene, CollectionScene } from './scenes';
import { IntroScene } from './scenes/intro.scene';

const width = window.outerWidth;
const height = window.outerHeight;

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width,
    height,
    backgroundColor: '#ADD8E6',
    scene: [InitialScene, MenuScene, IntroScene, LoadingScene, LobbyScene, BracketScene, CollectionScene, ResultsScene, WinnerScene]
};

const game = new Phaser.Game(config);
