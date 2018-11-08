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

        // find map config wall and water layers
        this.mapConfig.layers.forEach(layer => {
            switch(layer.name) {
                case 'Wall':
                    this.mapConfigWallsLayer = layer;
                    break;
                case 'Water':
                    this.mapConfigWaterLayer = layer;
                    break;
                default:
                    break;
            }
        });

        if (this.mapConfigWallsLayer == null) throw `walls map layer not found`;
        if (this.mapConfigWaterLayer == null) throw `walls map layer not found`;

        // our map
        this.map = [];

        // map entity collections
        this.players = [];
        this.walls = [];
        this.water = [];

        // create map with map cells filled with walls and water entities
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                let index = this.calcMapIndex(x, y);
                let mapCell = new MapCell(x, y);

                if (this.mapConfigWallsLayer.data[index] > 0) {
                    let wall = new MapEntityWall(x, y);

                    this.walls.push(wall);

                    mapCell.addEntity(wall);
                }

                if (this.mapConfigWaterLayer.data[index] > 0) {
                    let water = new MapEntityWater(x, y);

                    this.water.push(water);

                    mapCell.addEntity(water);
                }

                this.map[index] = mapCell;
            }
        } 
    }

    get width () { return this.mapConfig.width; }

    get height () { return this.mapConfig.height; }

    calcMapIndex (x, y) { return x + this.width * y; }

    findRandomEmptyMapCell () {
        // todo: while ! found and tries < 100 generate random Int and see if cell is empty
        let found = false;
        let tries = 0;
        let foundMapCell = null;
        let minIndex = 0;
        let maxIndex = this.width * this.height;

        while (!found && tries < 100) {
            let randIndex = Math.floor(Math.random() * (maxIndex - minIndex));
            let mapCell = this.map[randIndex];
            if (mapCell.entities.length === 0) {
                foundMapCell = mapCell;
                found = true;
            }
            tries++;
        }

        if (foundMapCell == null) throw `could not find empty map cell!`;

        return foundMapCell;
    }

    addNewUserToMap (user) {
        // generate a player map entity in a random empty cell
        let emptyMapCell = this.findRandomEmptyMapCell();

        let player = new MapEntityPlayer(emptyMapCell.x, emptyMapCell.y, user);

        emptyMapCell.addEntity(player);

        this.players.push(player);

        user.player = player;
    }
}

export default Map;