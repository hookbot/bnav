import MapEntity from '../map-entity';
import User from '../user';

class Player extends MapEntity {
    constructor (x, y, user) {
        super(x, y);

        if (!(user instanceof User)) throw `${typeof user} is not a User`;

        this.user = user;
    }
}

export default Player;