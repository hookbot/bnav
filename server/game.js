import Map from './game/map';
import User from './game/user';

class Game {
    constructor (webSocketServer) {
        this.webSocketServer = webSocketServer;

        this.map = new Map();

        this.users = {};
    }

    addUser (userName) {
        if (this.users[userName]) throw `User, ${userName} already exists in game.`;

        this.users[userName] = new User(userName);
    }
}

export default Game;