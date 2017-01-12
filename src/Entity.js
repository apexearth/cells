if (typeof window !== 'undefined') {
    const PIXI = require('pixi.js')
}
const GameObject = require('./GameObject')
const ReproductionSpawnTypes = require('./ReproductionSpawnTypes')
const DNA = require('./DNA')
const angle = require('./angle')
const config = require('./config')

class Entity extends GameObject {
    constructor(options) {
        super(options)
        this.parent.entityCount++

        this.alive = true
        this.dna = options.dna || Entity.defaultDNA()
        this.stats = options.stats || this.defaultStats()
        this.data = {
            spawnedChildren: 0
        }

        this.data.attachments = []

        if (typeof window !== 'undefined') {
            this.graphics = new PIXI.Graphics()
            this.container.addChild(this.graphics)
            this.draw()
        }
    }

    get color() {
        return (
            (this.dna.color[0] << 16) +
            (this.dna.color[1] << 8 ) +
            (this.dna.color[2])
        )
    }

    get spawnType() {
        return this.dna.spawnType
    }

    get photosynthesis() {
        return this.dna.photosynthesis
    }

    get age() {
        return this.stats.age
    }

    set age(val) {
        this.stats.age = val
    }

    get ageMaximum() {
        return this.dna.ageMaximum
    }

    get movementThrust() {
        return this.dna.movementThrust
    }

    get movementEfficiency() {
        return this.dna.movementEfficiency
    }

    get mass() {
        return this.stats.mass
    }

    set mass(value) {
        this.scale.x = this.scale.y = Math.sqrt(Math.max(0, this.stats.mass = value) / Math.PI)
    }

    get massMinimum() {
        return this.dna.massMinimum
    }

    get massMaximum() {
        return this.dna.massMaximum
    }

    get massEfficiency() {
        return this.dna.massEfficiency
    }

    get collectionName() {
        return "entities"
    }


    draw() {
        if (!this.graphics) return
        this.graphics.clear()
        this.graphics.beginFill(this.color, this.alive ? .5 : .125)
        this.graphics.lineStyle(.1, this.color, this.alive ? 1 : .25)
        this.graphics.drawCircle(0, 0, 1)
        this.graphics.endFill()
    }

    update(seconds) {
        super.update(seconds)
        if (!this.alive) {
            this.decay(seconds)
            return
        }

        this.mass -= (this.mass * .01 / this.massEfficiency) * seconds
        this.mass += Math.min(this.inputs.light, this.photosynthesis) * seconds


        this.age += seconds
        if (this.age > this.ageMaximum) {
            this.die()
            return
        }

        this.spawn(seconds)

        this.mass -= this.movementThrust / this.movementEfficiency / 100
        this.momentum.x = (this.momentum.x + (Math.random() - .5) * this.movementThrust)
        this.momentum.y = (this.momentum.y + (Math.random() - .5) * this.movementThrust)

        for (let attachment of this.data.attachments) {
            if (!attachment.entity.alive) continue
            let position = angle.positionAngle(this.position, attachment.angle, this.scale.x + attachment.entity.scale.x)
            attachment.entity.position.x = position.x
            attachment.entity.position.y = position.y

        }
    }

    defaultStats() {
        return {
            age: 0,
            mass: this.massMaximum
        }
    }

    static get ReproductionSpawnTypes() {
        return ReproductionSpawnTypes
    }

    static defaultDNA() {
        return new DNA()
    }

    mutatedDNA() {
        return this.dna.createMutation()
    }

    spawn(seconds) {
        // Checks
        if (this.parent.collections.all.size > config.entityLimit) {
            return
        }
        if (Math.random() > this.dna.spawnChance * seconds) {
            return
        }
        if (this.dna.spawnMinimumAge > this.age ||
            this.dna.spawnMinimumMass > this.mass ||
            this.dna.spawnedChildrenLimit < this.data.spawnedChildren) {
            return
        }
        if (this.spawnType === ReproductionSpawnTypes.Attached &&
            this.data.attachments.length >= this.dna.attachmentLimit << 0) {
            return
        }

        // Do it
        this.data.spawnedChildren++
        let position = this.position
        let rotation = this.rotation
        if (this.spawnType === ReproductionSpawnTypes.Attached) {
            position = angle.positionAngle(this.position, rotation, this.radius * 2)
            rotation += this.dna.attachmentAngle +
                Math.random() * (this.dna.attachmentAngleVariability - this.dna.attachmentAngleVariability / 2)
        }
        const spawn = new Entity({
            parent: this.parent,
            position,
            rotation,
            dna: this.mutatedDNA()
        })
        this.parent.add(spawn)
        spawn.mass = .01

        if (this.spawnType === ReproductionSpawnTypes.Projectile) {
            this.mass *= .8
            spawn.momentum.x += (Math.random() - .5) * this.mass / 2
            spawn.momentum.y += (Math.random() - .5) * this.mass / 2
        } else if (this.spawnType === ReproductionSpawnTypes.Attached) {
            this.data.attachments.push({entity: spawn, angle: rotation})
        }
        return spawn
    }

    decay(seconds) {
        let lostMass = .01 * seconds + this.mass * (.1 * seconds)
        this.parent.inputs.mass += lostMass
        this.mass -= lostMass
        if (this.mass < this.massMinimum / 2) {
            this.remove()
        }
    }

    die() {
        if (!this.alive) return
        this.alive = false
        this.parent.entityCount--
        this.dna.color[0] = 0x88
        this.dna.color[1] = 0x88
        this.dna.color[2] = 0x88
        this.draw()
    }

    remove() {
        super.remove(this)
        this.parent.remove(this)
    }
}

module.exports = Entity
