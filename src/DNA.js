let ReproductionSpawnTypes = require('./ReproductionSpawnTypes')

class DNA {
    constructor(template = {}) {
        this.color = new Uint8Array(3)
        if (!template.color) {
            this.color[0] = 150
            this.color[1] = 250
            this.color[2] = 150
        } else {
            this.color[0] = template.color[0]
            this.color[1] = template.color[1]
            this.color[2] = template.color[2]
        }
        this.spawnType          = pick(template.spawnType, ReproductionSpawnTypes.Attached)
        this.spawnChance        = pick(template.spawnChance, .25)
        this.spawnMinimumAge    = pick(template.spawnMinimumAge, 2)
        this.photosynthesis     = pick(template.photosynthesis, 2)
        this.ageMaximum         = pick(template.ageMaximum, 20)
        this.movementThrust     = pick(template.movementThrust, 0)
        this.movementEfficiency = pick(template.movementEfficiency, 1)
        this.massMinimum        = pick(template.massMinimum, 1)
        this.massMaximum        = pick(template.massMaximum, 3)
        this.massEfficiency     = pick(template.massEfficiency, 1)

        if (this.spawnType === ReproductionSpawnTypes.Attached) {
            this.attachmentLimit            = 0
            this.attachmentAngle            = 0
            this.attachmentAngleVariability = 0
        }
        if (typeof this.attachmentLimit !== "undefined") this.attachmentLimit = pick(template.attachmentLimit, 1)
        if (typeof this.attachmentAngle !== "undefined") this.attachmentAngle = pick(template.attachmentAngle, Math.PI * .5 - .25)
        if (typeof this.attachmentAngleVariability !== "undefined") this.attachmentAngleVariability = pick(template.attachmentAngleVariability, Math.PI)
    }

    createMutation(mutateAmount = .1) {
        const mod = () => 1 + (Math.random() - .5) * mutateAmount

        // copy
        const template    = Object.assign({}, this)
        template.color    = new Uint8Array(3)
        template.color[0] = this.color[0]
        template.color[1] = this.color[1]
        template.color[2] = this.color[2]

        // mutate
        for (let key in template) {
            if (key === 'massEfficiency') {
                template.massEfficiency = Math.max(.1, template.massEfficiency * mod())
            } else if (key === 'massMinimum') {
            } else if (key === 'massMaximum') {
            } else if (key === 'color') {
                template.color[0] = Math.min(255, Math.max(100, template.color[0] * mod()))
                template.color[1] = Math.min(255, Math.max(100, template.color[1] * mod()))
                template.color[2] = Math.min(255, Math.max(100, template.color[2] * mod()))
            } else if (typeof template[key] === 'number') {
                template[key] *= mod()
                if (Math.random() < .1) {
                    template[key] = Math.max(0, template[key] + (Math.random() - .5) * .01)
                }
            }
        }
        template.massMinimum = Math.max(.5, template.massMinimum)
        template.massMaximum = Math.max(template.massMinimum * 2, template.massMaximum)

        if (Math.random() < .01) {
            let types          = Object.keys(ReproductionSpawnTypes)
            template.spawnType = ReproductionSpawnTypes[types[types.length * Math.random() << 0]]
        }

        return new DNA(template)
    }
}

function pick(pick1, pick2) {
    return typeof pick1 !== "undefined" ? pick1 : pick2
}

module.exports = DNA