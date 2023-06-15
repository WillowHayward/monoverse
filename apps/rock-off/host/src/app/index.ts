import * as Phaser from 'phaser';
import { MenuScene } from './scenes/menu';
import { LobbyScene } from './scenes/lobby';
import { LoadingScene } from './scenes/loading';
import { BracketScene } from './scenes/bracket';
import { RoundCollectionScene } from './scenes/round-collection';
import { RoundResultsScene } from './scenes/round-results';

const width = window.outerWidth;
const height = window.outerHeight;

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width,
    height,
    backgroundColor: '#ADD8E6',
    scene: [MenuScene, LobbyScene, LoadingScene, BracketScene, RoundCollectionScene, RoundResultsScene]
};

const game = new Phaser.Game(config);
