var expect = require('chai').expect
var index = require('./index.js')

describe("index.js", function () {

    it(".update()", function () {
        index.update(.1)
    })

    it('bench .update()', function () {
        for (let i = 0; i < 650; i++) {
            index.update(1 / 60)
        }
    })

})