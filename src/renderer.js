if (typeof window !== 'undefined') {
    const PIXI = require('pixi.js')
}
const input = require('./input')

module.exports = function renderer(root, loop) {
    const renderer = new PIXI.WebGLRenderer(width(), height())
    document.body.appendChild(renderer.view)
    function width() {
        return typeof window !== 'undefined' ? window.innerWidth : 500
    }

    function height() {
        return typeof window !== 'undefined' ? window.innerHeight : 500
    }


    const stage = root.container
    let lastMouseX = input('mouseX')
    let lastMouseY = input('mouseY')
    document.addEventListener('mousewheel', mousewheelZoom)

    const zoomSpeed = .02
    const zoomMin = .1
    const zoomMax = 32
    let zoomTarget = 1

    function mousewheelZoom(event) {
        let amount = zoomSpeed * 15
        if (event.deltaY > 0 && stage.scale.y > zoomMin) {
            zoomOut(amount)
        }
        if (event.deltaY < 0 && stage.scale.y < zoomMax) {
            zoomIn(amount)
        }
    }

    function zoomOut(amount) {
        zoomTarget = Math.max(zoomMin, zoomTarget - amount)
    }

    function zoomIn(amount) {
        zoomTarget = Math.min(zoomMax, zoomTarget + amount)
    }

    let last = Date.now()

    function animate() {
        requestAnimationFrame(animate)
        let seconds = Math.min(.1, (Date.now() - last) / 1000)
        loop(root)
        if (window.innerWidth !== renderer.view.width || window.innerHeight !== renderer.view.height) {
            renderer.resize(window.innerWidth, window.innerHeight)
        }

        if (input('mouse2')) {
            stage.position.x += input('mouseX') - lastMouseX
            stage.position.y += input('mouseY') - lastMouseY
        }

        const scrollSpeed = 6
        if (input('up')) {
            stage.position.y += scrollSpeed
        }
        if (input('down')) {
            stage.position.y -= scrollSpeed
        }
        if (input('left')) {
            stage.position.x += scrollSpeed
        }
        if (input('right')) {
            stage.position.x -= scrollSpeed
        }
        if (input('zoomOut') && stage.scale.y > zoomMin) {
            zoomOut(zoomSpeed)
        }
        if (input('zoomIn') && stage.scale.y < zoomMax) {
            zoomIn(zoomSpeed)
        }

        let zoomChange = (zoomTarget - stage.scale.x) * seconds * 5
        stage.position.x += (stage.position.x - window.innerWidth / 2) * zoomChange / stage.scale.x
        stage.position.y += (stage.position.y - window.innerHeight / 2) * zoomChange / stage.scale.y
        stage.scale.x = stage.scale.y += zoomChange
        renderer.render(stage)
        lastMouseX = input('mouseX')
        lastMouseY = input('mouseY')
        last = Date.now()
    }

    animate()

    root.container.position.x = width() / 2
    root.container.position.y = height() / 2
}