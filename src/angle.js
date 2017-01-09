module.exports = {
    rad          : (p1, p2) => {
        return Math.atan2(p2.y - p1.y, p2.x - p1.x)
    },
    deg          : (p1, p2) => {
        return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI
    },
    random       : () => {
        return Math.random() * Math.PI * 2
    },
    positionAngle: (position, angle, distance) => {
        return {
            x: position.x + Math.cos(angle) * distance,
            y: position.y + Math.sin(angle) * distance
        }
    }
}