if (typeof window !== 'undefined') {
    var PIXI = require('pixi.js')
}

class RenderedObject {
    constructor(options = {}) {
        if (!options.parent) throw new Error('No parent recieved.')
        this.parent = options.parent

        if (typeof window !== 'undefined') {
            this.container = new PIXI.Container()
            this.parent.container.addChild(this.container)
        } else {
            this.container = { // Mock
                position: {x: 0, y: 0},
                scale   : {x: 1, y: 1},
                rotation: 0,
            }
        }

        if (options.position) {
            this.position.x = options.position.x
            this.position.y = options.position.y
        }
        this.rotation = options.rotation || 0;
    }

    get position() {
        return this.container.position
    }

    get scale() {
        return this.container.scale
    }

    get rotation() {
        return this.container.rotation
    }
    set rotation(val) {
        this.container.rotation = val
    }

    update(seconds) {
        // Virtual
    }

    remove() {
        if (typeof window !== 'undefined') {
            this.parent.container.removeChild(this.container)
        }
    }
}

module.exports = RenderedObject
