import testMap from '../../assets/json/test-map.json';

import MapCell from './map-cell';
import MapEntityPlayer from './map-entity/player';
import MapEntityWall from './map-entity/wall';
import MapEntityWater from './map-entity/water';
import User from './user';

class Map {
    constructor () {
        // our map config
        this.mapConfig = testMap;

        // aliases to specific layers of our map config
        this.mapConfigWallsLayer = null;
        this.mapConfigWaterLayer = null

        // todo: find map config wall and water layers

        // our map
        this.map = [];

        // map entity collections
        this.players = [];
        this.walls = [];
        this.water = [];

        // todo: create map with map cells filled with walls and water entities 
    }

    get width () { return this.map.width; }

    get height () { return this.map.height; }

    calcMapIndex (x, y) { return x + this.width * y; }

    findRandomEmptyMapCell () {
        // todo: while ! found and tries < 100 generate random Int and see if cell is empty
    }

    addNewUserToMap (user) {
        // todo: generate a player map entity in a random empty cell
    }
}

export default Map;