if (typeof window !== 'undefined') {
    const PIXI = require('pixi.js')
}
const Quadtree = require('../../endless-quadtree')

// Attached Classes
const Entity = require('./Entity')
const Light  = require('./Light')


class World {
    constructor(options) {
        this.options     = Object.assign(this.defaultOptions, options)
        this.inputs      = {
            mass: 0
        }
        this.outputs     = {
            light: 2
        }
        this.entityCount = 0
        this.collections = {
            all     : new Set(),
            lights  : new Set(),
            entities: new Set()
        }
        this.quadtree    = new Quadtree({
            dimensions    : ['x', 'y'],
            entityLimit   : 10,
            childrenSize  : 10,
            entityCoordKey: 'position'
        })
        if (typeof window !== 'undefined') {
            this.container = new PIXI.Container()
        }
    }

    // Classes
    static get Entity() {
        return Entity
    }

    static get Light() {
        return Light
    }

    update(seconds) {
        this.collections.all.forEach(object => {
            object.resetInputs()
            object.inputs.light += this.outputs.light / Math.sqrt(this.entityCount)
        })
        this.collections.lights.forEach(object => object.update(seconds))
        this.collections.entities.forEach(object => object.update(seconds))
        this.quadtree.update()
    }

    add(object) {
        if(this.collections.all.size > 3000) return // TODO: Hard Limit
        this.collections[object.collectionName].add(object)
        this.collections.all.add(object)
    }

    remove(object) {
        this.collections[object.collectionName].delete(object)
        this.collections.all.delete(object)
    }

    get(position, distance) {
        return this.quadtree.getWithinDistance(position, distance)
    }

    get defaultOptions() {
        return {}
    }
}

module.exports = World
