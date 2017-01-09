if (typeof window !== 'undefined') {
    const PIXI = require('pixi.js')
}
const RenderedObject = require('./RenderedObject')

class MovableRenderedObject extends RenderedObject {
    constructor(options) {
        super(options)
        this.position_prev = this.position
        this.momentum = Object.assign({x: 0, y: 0}, options.momentum)
        this.momentum_prev = {x: 0, y: 0}
    }

    update() {
        this.updatePrevious()
        this.updateMovement()
    }

    updateMovement() {
        this.position.x += this.momentum.x
        this.position.y += this.momentum.y
    }

    updatePrevious() {
        this.position_prev = Object.assign({}, this.position)
        this.momentum_prev = Object.assign({}, this.momentum)
    }

    remove() {
        super.remove(this)
    }
}

module.exports = MovableRenderedObject
