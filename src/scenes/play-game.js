import io from 'socket.io-client';

export default class PlayGameScene extends Phaser.Scene {
    constructor (config, key = 'PlayGame') {
        super({ key: key });
    }

    preload () {
        // load all the resources required for this scene before using them
    }

    init () {
        // Catch AppMessage Input
        this.game.appMessage = document.getElementById('app_message');
        this.game.appMessage.addEventListener('keypress', (e) => this.handleAppMessageKey(e));
    }

    create () {
        this.socket = io('http://localhost:8000/');
        this.socket.on('yourID', function (arg) {
            console.log('yourID:', arg);
        });
    }

    update () {
    }

    handleAppMessageKey(e) {
        let message = this.game.appMessage.value;
        if (e == null)
            return;
        if (e.which == 13 || e.keyCode == 13 || e.charCode == 13) {
            console.log("MESSAGE ENTERED: " + message);
            this.socket.emit('sendMessage', message);
            this.game.appMessage.value = '';
        }
    }
};
