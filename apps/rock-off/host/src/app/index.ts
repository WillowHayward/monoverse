import * as Phaser from 'phaser';
import { MenuScene, LobbyScene, LoadingScene, BracketScene, RoundCollectionScene, RoundResultsScene, RoundRematchCollectionScene, RoundRematchResultsScene, WinnerScene } from './scenes';

const width = window.outerWidth;
const height = window.outerHeight;

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width,
    height,
    backgroundColor: '#ADD8E6',
    scene: [MenuScene, LobbyScene, LoadingScene, BracketScene, RoundCollectionScene, RoundResultsScene, RoundRematchCollectionScene, RoundRematchResultsScene, WinnerScene]
};

const game = new Phaser.Game(config);
