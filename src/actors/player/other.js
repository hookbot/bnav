import Player from '../player';

export default class PlayerOther extends Player {
    constructor (scene, x = 0, y = 0) {
        let atlasKey = 'redboy';

        super(scene, x, y, atlasKey);
    }
}