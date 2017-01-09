const MovableRenderedObject = require('./MovableRenderedObject')
const angle                 = require('./angle')

class GameObject extends MovableRenderedObject {
    constructor(options) {
        super(options)
        this.resetInputs()

        this.collider = options.collider || false
        if (this.collider) {
            this.parent.quadtree.add(this)
        }
        this.radius   = 1
        this.friction = 1
    }

    get mass() {
        return 0
    }

    resetInputs() {
        this.inputs = {
            light: 0
        }
    }

    update(seconds) {
        super.update(seconds)
        this.momentum.x *= (100 - this.friction * seconds * 100) / 100
        this.momentum.y *= (100 - this.friction * seconds * 100) / 100

        this.checkCollisions(seconds)
    }

    checkCollisions(seconds) {
        let collisions = this.parent.quadtree.getWithinDistance(this.position, this.scale.x)
        for (let collision of collisions) {
            let a = angle.rad(this.position, collision.position)
            if (a === 0) a = Math.random() * Math.PI * 2
            collision.momentum.x += Math.cos(a) * this.mass * seconds
            collision.momentum.y += Math.sin(a) * this.mass * seconds
            this.momentum.x -= Math.cos(a) * collision.mass * seconds
            this.momentum.y -= Math.sin(a) * collision.mass * seconds
        }
    }

    remove() {
        super.remove(this)
        if (this.collider) {
            this.parent.quadtree.remove(this)
        }
    }
}

module.exports = GameObject
