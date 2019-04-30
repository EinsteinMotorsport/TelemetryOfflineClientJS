/*
 (c) 2017, Vladimir Agafonkin
 Simplify.js, a high-performance JS polyline simplification library
 mourner.github.io/simplify-js
*/

// square distance from a point to a segment
function getSqSegDist(pTime, pValue, p1Time, p1Value, p2Time, p2Value) {

    let x = p1Time
    let y = p1Value
    let dx = p2Time - x
    let dy = p2Value - y

    if (dx !== 0 || dy !== 0) {
        const t = ((pTime - x) * dx + (pValue - y) * dy) / (dx * dx + dy * dy)

        if (t > 1) {
            x = p2Time
            y = p2Value

        } else if (t > 0) {
            x += dx * t
            y += dy * t
        }
    }

    dx = pTime - x
    dy = pValue - y

    return dx * dx + dy * dy
}
// rest of the code doesn't care about point format

function simplifyDPStep(points, first, last, sqTolerance, simplified) {
    let maxSqDist = sqTolerance
    let index

    for (let i = first + 1; i < last; i++) {
        const sqDist = getSqSegDist(points[i * 2], points[i * 2 + 1], points[first * 2], points[first * 2 + 1], points[last * 2], points[last * 2 + 1])
        
        if (sqDist > maxSqDist) {
            index = i
            maxSqDist = sqDist
        }
    }

    if (maxSqDist > sqTolerance) {
        if (index - first > 1) 
            simplifyDPStep(points, first, index, sqTolerance, simplified)
        simplified.push(points[index * 2], points[index * 2 + 1])
        if (last - index > 1) 
            simplifyDPStep(points, index, last, sqTolerance, simplified)
    }
}

// simplification using Ramer-Douglas-Peucker algorithm
function simplifyDouglasPeucker(points, sqTolerance) {
    const last = points.length / 2 - 1

    const simplified = [points[0], points[1]]
    simplifyDPStep(points, 0, last, sqTolerance, simplified)
    simplified.push(points[last * 2], points[last * 2 + 1])

    return simplified
}

/**
 * @param {Float64Array} points 
 * @param {number} tolerance 
 */
function simplify(points, tolerance) {
    if (points.length / 2 <= 2)
        return points

    const sqTolerance = tolerance * tolerance

    points = simplifyDouglasPeucker(points, sqTolerance)

    return Float64Array.from(points)
}

export default simplify
