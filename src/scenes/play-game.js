import io from 'socket.io-client';

import gameConfig from '../../config/game.json';

export default class PlayGameScene extends Phaser.Scene {
    constructor (config, key = 'PlayGame') {
        super({ key: key });
    }

    preload () {
        this.load.tilemapTiledJSON('map', 'test-map.json');
        this.load.image('Rob_Tileset', 'Rob_Tileset.png');
        // load all the resources required for this scene before using them
    }

    init () {
        // Catch AppMessage Input
        this.game.appMessage = document.getElementById('app_message');
        this.game.appMessage.addEventListener('keypress', (e) => this.handleAppMessageKey(e));
    }

    create () {
        this.socket = io('http://localhost:8000/');
        this.socket.on('yourID', (playerID) => {
            console.log('yourID:', playerID);
            this.playerID = playerID;
        });
        this.socket.on('yourUserName', (userName) => {
            console.log('yourUserName:', userName);
            this.userName = userName;
        });
        this.socket.on('serverReport', (line) => {
            console.log('SERVER: ' + line);
        });

        this.setupMap();
    }

    setupMap () {
        this.tilemap = this.make.tilemap({ key: 'map' });
        this.tilesets = {};
        gameConfig.map.tilesets.forEach(tileset => {
            this.tilesets[tileset.key] = this.tilemap.addTilesetImage(tileset.key);
        });

        this.tileLayers = {};
        gameConfig.map.tileLayers.forEach(layer => {
            this.tileLayers[layer.name] = this.tilemap.createDynamicLayer(layer.name, this.tilesets[layer.tileset], 0, 0);
        });

        this.physics.world.setBounds(0, 0, this.tilemap.widthInPixels, this.tilemap.heightInPixels);
        this.cameras.main.setBounds(0, 0, this.tilemap.widthInPixels, this.tilemap.heightInPixels);
    }

    update () {
    }

    handleAppMessageKey(e) {
        let message = this.game.appMessage.value;
        if (e == null)
            return;
        if (message == '')
            return;
        if (e.which == 13 || e.keyCode == 13 || e.charCode == 13) {
            var contents = message.split(" ");
            this.game.appMessage.value = '';
            if (contents[0] == '/login') {
                this.game.appMessage.value = '';
                console.log("LOGIN AS USER: " + contents[1]);
                this.socket.emit('doLogin', contents[1]);
            }
            else if (contents[0].substr(0,1) == '/') {
                console.log("Unknown command: " + contents[0]);
                this.game.appMessage.value = message;
            }
            else {
                // Send message to server.
                console.log("MESSAGE: " + message);
                this.socket.emit('sendMessage', message);
            }
        }
    }
};
