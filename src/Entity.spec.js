const expect = require('chai').expect
const World  = require('./World.js')

describe("Entity.js", function () {
    let world
    let object

    beforeEach(() => {
        world  = new World()
        object = new World.Entity({parent: world})
        world.add(object)
    })
    it("new", () => {
        expect(object).to.exist
        expect(world.collections.entities.size).to.equal(1)
        expect(object.position).to.deep.equal({x: 0, y: 0})
    })
    it('has a reference-able constructor', () => {
        expect(object.constructor).to.equal(World.Entity)
    })
    it("can starve", () => {
        world.outputs.light = 0
        expect(object.alive).to.equal(true)
        object.update(200)
        expect(object.alive).to.equal(false)
    })
    it('can consume food and grow', () => {
        let initialMass = object.mass
        world.update(1)
        expect(object.mass).to.be.gt(initialMass)
    })
    it('can reproduce', () => {
        object.dna.spawnChance     = 1
        object.dna.spawnMinimumAge = 0
        world.update(object.ageMaximum - 1)
        expect(world.collections.entities.size).to.be.gt(1)
    })
    it('will eventually disappear after dying, adding to some kind of world stockpile of organic residue', () => {
        let entity = new World.Entity({parent: world})
        world.add(entity)
        entity.alive    = false
        let initialMass = entity.mass
        world.update(100)
        expect(entity.mass).to.be.lt(initialMass)
    })

    it('Attached reproduction Entity', () => {
        let dna       = World.Entity.defaultDNA()
        dna.spawnType = World.Entity.ReproductionSpawnTypes.Attached
        let entity    = new World.Entity({
            parent: world,
            dna
        })
        world.add(entity)

        expect(entity.data.attachments).to.exist
        expect(entity.data.attachments.length).to.equal(0)

        entity.dna.spawnChance     = 1000
        entity.dna.spawnMinimumAge = 5
        entity.age                 = 5
        entity.mass                = entity.massMaximum * 2
        world.update(.1)

        expect(entity.data.attachments.length).to.equal(1)

        entity.mass = entity.massMaximum * 2
        world.update(.1)

    })

})