export default class Player extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, atlasKey) {
        super(scene, x, y, atlasKey, `${atlasKey}0.png`);

        this.atlasKey = atlasKey;
    }

    // will only be invoked if added to gameobject (not just physics object)
    preUpdate (time, delta) {
        if (super.preUpdate) super.preUpdate(time, delta);
    }
}