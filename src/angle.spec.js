require('should')
const angle = require('./angle.js')

describe("angle.js", function () {

    it("rad", function () {
        // 1/4 PI
        let radians = angle.rad({x: 0, y: 0}, {x: 1, y: 1})
        radians.should.equal(0.7853981633974483)

        // -3/4 PI
        radians = angle.rad({x: 0, y: 0}, {x: -1, y: -1})
        radians.should.equal(-2.356194490192345)

        // 0 PI
        radians = angle.rad({x: 0, y: 0}, {x: 1, y: 0})
        radians.should.equal(0)

        // 1 PI
        radians = angle.rad({x: 0, y: 0}, {x: -1, y: 0})
        radians.should.equal(3.141592653589793)

        // 1/2 PI
        radians = angle.rad({x: 0, y: 0}, {x: 0, y: 1})
        radians.should.equal(1.5707963267948966)

        // -1/2 PI
        radians = angle.rad({x: 0, y: 0}, {x: 0, y: -1})
        radians.should.equal(-1.5707963267948966)
    })

    it("rad", function () {
        // 1/4 PI
        let radians = angle.deg({x: 0, y: 0}, {x: 1, y: 1})
        radians.should.equal(45)

        // -3/4 PI
        radians = angle.deg({x: 0, y: 0}, {x: -1, y: -1})
        radians.should.equal(-135)

        // 0 PI
        radians = angle.deg({x: 0, y: 0}, {x: 1, y: 0})
        radians.should.equal(0)

        // 1 PI
        radians = angle.deg({x: 0, y: 0}, {x: -1, y: 0})
        radians.should.equal(180)

        // 1/2 PI
        radians = angle.deg({x: 0, y: 0}, {x: 0, y: 1})
        radians.should.equal(90)

        // -1/2 PI
        radians = angle.deg({x: 0, y: 0}, {x: 0, y: -1})
        radians.should.equal(-90)
    })

    it("random", function () {
        for (let i = 0; i < 100; i++) {
            let radians = angle.random()
            radians.should.be.greaterThanOrEqual(0)
            radians.should.be.lessThanOrEqual(360)
        }
    })

    it("positionAngle", function () {
        let position = angle.positionAngle({x: 0, y: 0}, 0, 100)
        position.x.should.equal(100)
        position.y.should.equal(0)

        position = angle.positionAngle({x: 0, y: 0}, -Math.PI, 100)
        position.x.should.equal(-100)
        position.y.should.be.lessThan(.001)

        position = angle.positionAngle({x: 0, y: 0}, Math.PI / 2, 100)
        position.x.should.be.lessThan(.001)
        position.y.should.equal(100)

        position = angle.positionAngle({x: 0, y: 0}, -Math.PI / 2, 100)
        position.x.should.be.lessThan(.001)
        position.y.should.equal(-100)
    })

})