const renderer = require('./renderer.js')
const World = require('./World')
const world = new World()
for (let i = 0; i < 1; i++) {
    world.add(new World.Entity({
        parent: world,
        position: {
            x: 0,
            y: 0,
        }
    }))
}

if (typeof window !== 'undefined') {
    let last
    renderer(world, function (world) {
        let current = Date.now()
        let seconds = (current - (last || current)) / 1000
        seconds = Math.min(seconds, .1)
        world.update(seconds)
        last = current
    })
}

module.exports = world