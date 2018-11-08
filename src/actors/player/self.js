import Player from '../player';

export default class PlayerSelf extends Player {
    constructor (scene, x = 0, y = 0) {
        let atlasKey = 'blueboy';

        super(scene, x, y, atlasKey);
    }
}