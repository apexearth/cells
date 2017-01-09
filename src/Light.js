if (typeof window !== 'undefined') {
    var PIXI = require('pixi.js')
}
var GameObject = require('./GameObject')

class Light extends GameObject {
    constructor(options) {
        super(options)
        this.strength = options.strength || 1000
        this.radius = options.radius || 1000

        if (typeof window !== 'undefined') {
            this.graphics = new PIXI.Graphics()
            this.graphics.beginFill(0xffffdd, .15)
            this.graphics.drawCircle(0, 0, this.radius)
            this.graphics.endFill()
            this.container.addChild(this.graphics)
            var blurFilter = new PIXI.filters.BlurFilter()
            blurFilter.blur = this.radius / 10
            this.container.filters = [blurFilter]
        }
    }

    get collectionName() {
        return "lights"
    }

    update(seconds) {
        var objects = this.parent.get(this.position, this.radius).filter(object => object.alive)
        var lightForEach = this.strength / objects.length * seconds
        objects.forEach(object => {
            object.inputs.light += lightForEach
        })
    }
}

module.exports = Light
