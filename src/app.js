import 'phaser';
import 'lodash';
import 'webfontloader';

require('./index.html'); // so we get it in the dist

// import scenes
import LoadingScene from './scenes/loading';
import MainMenuScene from './scenes/main-menu';
import PlayGameScene from './scenes/play-game';

var gameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            //debug: true, // enable to see physics bodies outlined
        }
    },
    scene: [LoadingScene, MainMenuScene, PlayGameScene]
}

let game = new Phaser.Game(gameConfig);
