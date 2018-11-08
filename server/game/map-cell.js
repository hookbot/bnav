import MapEntity from './map-entity';

class MapCell {
    constructor (x, y) {
        this._x = x;
        this._y = y;

        this._entities = [];
    }

    get x () { return this._x; }

    get y () { return this._y; }

    addEntity (entity) {
        if (!(entity instanceof MapEntity)) throw `${typeof entity} is not a MapEntity`;

        this._entities.push(entity);
    }

    get entities () { return this._entities; }
}

export default MapCell;