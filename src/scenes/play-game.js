import io from 'socket.io-client';

export default class PlayGameScene extends Phaser.Scene {
    constructor (config, key = 'PlayGame') {
        super({ key: key });
    }

    preload () {
        // load all the resources required for this scene before using them
    }

    init () {
    }

    create () {
        this.socket = io('http://localhost:8000/');
    }

    update () {
    }
};
