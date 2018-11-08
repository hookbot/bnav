import testMap from '../../assets/json/test-map.json';

class Map {
    constructor () {
        this.map = testMap;
    }

    get width () { return this.map.width; }

    get height () { return this.map.height; }
}

export default Map;