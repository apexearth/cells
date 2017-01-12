const renderer = require('./renderer.js')
const World = require('./World')
const world = new World()
for (let i = 0; i < 10; i++) {
    world.add(new World.Entity({
        parent: world,
        position: {
            x: 500 * Math.cos(Math.random() * Math.PI * 2) * Math.random(),
            y: 500 * Math.sin(Math.random() * Math.PI * 2) * Math.random(),
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