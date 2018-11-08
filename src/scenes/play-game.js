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
        this.load.atlas('move_arrows', 'move_arrows.png', 'move_arrows.json');
        this.load.atlas('turn_arrows', 'turn_arrows.png', 'turn_arrows.json');
        this.load.atlas('shield', 'shield.png', 'shield.json');
        this.load.image('brownBox', 'brown_box.png');
        this.load.image('lightBox', 'highlight_box.png');
        this.load.image('cancel', 'red_x.png');
        this.load.atlas('blueboy', 'blueboy.png', 'blueboy.json');
        this.load.atlas('redboy', 'redboy.png', 'redboy.json');
        // load all the resources required for this scene before using them
    }

    init () {
        // Catch AppMessage Input
        this.game.appMessage = document.getElementById('app_message');
        this.game.appMessage.addEventListener('keypress', (e) => this.handleAppMessageKey(e));
        // Catch ServerStatus
        this.game.serverStatus = document.getElementById('server_status');
        this.game.actionQueue = [];
        this.cameras.main.zoom = 3;
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
            this.appendServerStatus('You are logged in as: ' + userName);
        });
        this.socket.on('serverReport', (line) => {
            console.log('SERVER: ' + line);
            this.appendServerStatus(line);
        });

        this.setupMap();

        this.playerSelf = new PlayerSelf(this, 100, 100);
        this.add.existing(this.playerSelf);
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

        let dashboard = this.add.container(0, 400);

        var rect = new Phaser.Geom.Rectangle(0, 0, 400, 200);
        var graphics = this.add.graphics({ fillStyle: { color: 0xFFD733 } });
        graphics.fillRectShape(rect);
        dashboard.add(graphics);

        let possibleActions = [ 
            { 'spriteSheet': 'turn_arrows', 'buttonName': 'clockwise_turn', 'x': 50, 'y': 150 },
            { 'spriteSheet': 'turn_arrows', 'buttonName': 'counter_clockwise_turn', 'x': 90, 'y': 150 },
            { 'spriteSheet': 'move_arrows', 'buttonName': 'left_arrow', 'x': 130, 'y': 150 },
            { 'spriteSheet': 'move_arrows', 'buttonName': 'up_arrow', 'x': 170, 'y': 150 },
            { 'spriteSheet': 'move_arrows', 'buttonName': 'down_arrow', 'x': 210, 'y': 150 },
            { 'spriteSheet': 'move_arrows', 'buttonName': 'right_arrow', 'x': 250, 'y': 150 }
        ];

        possibleActions.forEach((element) => {
            dashboard.add(this.add.image(element.x, element.y, element.spriteSheet, element.buttonName).setScale(2).setInteractive().on('pointerdown', () => this.handleDashboardButton(element.buttonName) ));
        });

        dashboard.setSize(400, 200);

        let n=0;
        for (let i=0; i<4; i++) {
            let brownBox = this.add.image(300, 30 + 40 * i, 'brownBox').setInteractive();
            brownBox.id = n;
            brownBox.on('pointerdown', () => this.handleActionQueue(brownBox));
            n++;
            dashboard.add(brownBox);

            brownBox = this.add.image(340, 30 + 40 * i, 'brownBox').setInteractive();
            brownBox.id = n;
            brownBox.on('pointerdown', () => this.handleActionQueue(brownBox));
            n++;
            dashboard.add(brownBox);
        }

    }

    update () {
    }

    handleDashboardButton (buttonType) {
        if (this.game.activeButton == buttonType) {
            this.game.activeButton = false;
        }
        else {
            this.game.activeButton = buttonType;
        }
        console.log(buttonType);
    }

    handleActionQueue(actionLocation) {
        console.log(actionLocation.id);
        this.game.actionQueue[actionLocation.id] = this.game.activeButton;
        console.log(this.game.actionQueue);
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
            else {
                // Send message to server.
                console.log("MESSAGE: " + message);
                this.socket.emit('sendMessage', message);
            }
        }
    }

    appendServerStatus (message) {
        this.game.serverStatus.value = this.game.serverStatus.value + '\n' + message;
        this.game.serverStatus.scrollTop = this.game.serverStatus.scrollHeight;
    };

};
