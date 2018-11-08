import io from 'socket.io-client';

import gameConfig from '../../config/game.json';

export default class DashboardScene extends Phaser.Scene {
    constructor (config, key = 'Dashboard') {
        super({ key: key });
    }

    preload () {
        this.load.atlas('move_arrows', 'move_arrows.png', 'move_arrows.json');
        this.load.atlas('turn_arrows', 'turn_arrows.png', 'turn_arrows.json');
        this.load.atlas('shield', 'shield.png', 'shield.json');
        this.load.image('brownBox', 'brown_box.png');
        this.load.image('lightBox', 'highlight_box.png');
        this.load.image('cancel', 'red_x.png');
        // load all the resources required for this scene before using them
    }

    init () {
        this.game.actionQueue = [];
    }

    update () {
    }

    create () {
        let dashboard = this.add.container(0, 390);

        var rect = new Phaser.Geom.Rectangle(0, 0, 390, 185);
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

        dashboard.setSize(390, 185);

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
};

