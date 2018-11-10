import io from 'socket.io-client';

import gameConfig from '../../config/game.json';

import PlayerSelf from '../actors/player/self';
import PlayerOther from '../actors/player/other';

export default class PlayGameScene extends Phaser.Scene {
    constructor (config, key = 'PlayGame') {
        super({ key: key });
    }

    preload () {
        this.load.tilemapTiledJSON('map', 'test-map.json');
        this.load.image('Rob_Tileset', 'Rob_Tileset.png');
        this.load.atlas('blueboy', 'blueboy.png', 'blueboy.json');
        this.load.atlas('redboy', 'redboy.png', 'redboy.json');
        // load all the resources required for this scene before using them
    }

    init () {
        // Catch AppMessage Input
        this.game.appMessage = document.getElementById('app_message');
        this.game.appMessage.addEventListener('keypress', (e) => this.handleAppMessageKey(e));
        this.game.appMessage.style.display = 'block';
        // Catch ServerStatus
        this.game.serverStatus = document.getElementById('server_status');
        this.game.serverStatus.style.display = 'block';
        this.cameras.main.zoom = 3;
    }

    create () {
        let wsBase = 'ws://localhost:8000/';
        if (document.location.port < 1024) {
            // Privileged port should use itself for WebSocket
            wsBase = document.location.href;
        }
        console.log("USING WEBSOCKET: " + wsBase);
        this.socket = io(wsBase);
        this.socket.on('yourID', (playerID) => {
            console.log('yourID:', playerID);
            this.playerID = playerID;
            if (this.userName) {
                let prev = this.userName;
                delete this.userName;
                this.appendServerStatus('You have been disconnected by the server.');
                this.socket.emit('doLogin', prev);
            }
        });
        this.socket.on('yourUserName', (userName) => {
            console.log('yourUserName:', userName);
            this.userName = userName;
            this.appendServerStatus('You are logged in as: ' + userName);
        });
        this.socket.on('serverReport', (line) => {
            console.log('SERVER: ' + line);
            this.appendServerStatus(line);
        });
        this.socket.on('disconnect', () => {
            console.log('WEBSOCKET SERVER TERMINATED CONNECTION!');
        });

        this.dashboard = this.scene.get('Dashboard');
        this.scene.launch('Dashboard');

        this.setupMap();

        this.playerSelf = this.add.existing(new PlayerSelf(this, 300, 230));
        console.log(this.playerSelf);
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
                if (contents[1]) {
                    console.log("LOGIN AS USER: " + contents[1]);
                    this.socket.emit('doLogin', contents[1]);
                }
            }
            else if (contents[0] == '/logout') {
                if (this.userName) {
                    console.log('LOGOUT!');
                    this.socket.emit('doLogout');
                }
                else {
                    console.log('Not logged in.');
                }
            }
            else if (contents[0].substr(0,1) == '/') {
                console.log("Unknown command: " + contents[0]);
                this.game.appMessage.value = message;
            }
            else if (this.userName) {
                // Appears to be logged in so send message to server.
                console.log("MESSAGE: " + message);
                this.socket.emit('sendMessage', message);
            }
            else {
                // Attempting to talk without being logged in.
                this.game.appMessage.value = message;
                this.appendServerStatus("You can't speak until after you /login");
            }
        }
    }

    appendServerStatus (message) {
        this.game.serverStatus.value = this.game.serverStatus.value + '\n' + message;
        this.game.serverStatus.scrollTop = this.game.serverStatus.scrollHeight;
    };

};
