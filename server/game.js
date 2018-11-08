import Map from './game/map';
import Player from './game/player';

class Game {
    constructor (webSocketServer) {
        this.webSocketServer = webSocketServer;

        this.map = new Map();

        this.players = {};
    }

    addPlayer (userName) {
        if (this.players[userName]) throw `Player, ${userName} already exists in game.`;

        this.players[userName] = new Player(userName);
    }
}

export default Game;