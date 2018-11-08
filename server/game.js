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

        let user = new User(userName);

        this.users[userName] = user;

        this.map.addNewUserToMap(user);
    }
}

export default Game;