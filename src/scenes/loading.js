// json imports
// import assetsConfig from '../config/assets.json';

// web fonts
// import WebFont from 'webfontloader';
// require('../../assets/css/fonts.css');
// require('../../assets/fonts/[font].ttf');

// require in other assets to be included but not added to cache at this time
// require('../../assets/sounds/sound.wav');
// require('../../assets/json/tilemap.json');
// require('../../assets/images/tileset.png');
require('../../assets/images/play.png');

export default class LoadingScene extends Phaser.Scene {
    constructor (config, key = 'Loading') {
        super({ key: key });
    }

    init () {
        // font loading
        this.areFontsLoaded = true;

        // Catch AppMessage Input
        this.game.appMessage = document.getElementById('app_message');
        this.game.appMessage.addEventListener('keypress', (e) => this.handleAppMessageKey(e));
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

    handleAppMessageKey(e) {
        let message = this.game.appMessage.value;
        if (e == null)
            return;
        if (e.which == 13 || e.keyCode == 13 || e.charCode == 13) {
            console.log("MESSAGE ENTERED: " + message);
            this.game.appMessage.value = '';
        }
    }

};
