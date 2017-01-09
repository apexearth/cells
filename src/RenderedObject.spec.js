var expect = require('chai').expect
var RenderedObject = require('./RenderedObject.js')

describe("RenderedObject.js", function () {
    var parent = {}
    it("new", function () {
        var object = new RenderedObject({
            parent,
            position: {x: 1, y: 3.6}
        })
        expect(object.parent).to.equal(parent)
        expect(object.position).to.deep.equal({x: 1, y: 3.6})
    })
})