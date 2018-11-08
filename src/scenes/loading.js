// json imports
// import assetsConfig from '../config/assets.json';

// web fonts
// import WebFont from 'webfontloader';
// require('../../assets/css/fonts.css');
// require('../../assets/fonts/[font].ttf');

// require in other assets to be included but not added to cache at this time
// require('../../assets/sounds/sound.wav');
require('../../assets/json/test-map.json');
require('../../assets/images/Rob_Tileset.png');
require('../../assets/images/play.png');
require('../../assets/images/move_arrows.png');
require('../../assets/json/move_arrows.json');
require('../../assets/images/turn_arrows.png');
require('../../assets/json/turn_arrows.json');
require('../../assets/images/blueboy.png');
require('../../assets/json/blueboy.json');
require('../../assets/images/redboy.png');
require('../../assets/json/redboy.json');
require('../../assets/images/shield.png');
require('../../assets/json/shield.json');
require('../../assets/images/brown_box.png');
require('../../assets/images/highlight_box.png');

export default class LoadingScene extends Phaser.Scene {
    constructor (config, key = 'Loading') {
        super({ key: key });
    }

    init () {
        // font loading
        this.areFontsLoaded = true;
    }

    preload () {
        // load json configuration files
        // this.cache.json.add('assetsConfig', assetsConfig);

        // load web fonts
        /* WebFont.load({
            active: function () {
                this.webfontsLoaded();
            }.bind(this),
            custom: {
                families: ['font name'],
                urls: ['fonts.css']
            }
        }); */
    }

    webfontsloaded () {
        this.areFontsLoaded = true;
    }

    update () {
        if (this.areFontsLoaded) {
            this.input.stopPropagation();
            this.scene.start('MainMenu');
        }
    }
};
