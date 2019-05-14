import { bisector } from 'd3-array'

export const getIndexBeforeX = (dataPoints, x) => {
    const bisect = bisector(d => d.time).left
    return bisect(dataPoints, x) - 1
}

export const getClosestDataPoint = (dataPoints, x) => {
    const index = getIndexBeforeX(dataPoints, x)
    const before = dataPoints[index]
    const after = dataPoints[index + 1]
    let item
    if (!before && !after)
        item = null
    else if (!before)
        item = after
    else if (!after)
        item = before
    else
        item = Math.abs(before.time - x) < Math.abs(after.time - x) ? before : after

    return item
}

/**
 * 
 * @param {Float64Array} dataPoints 
 * @param {*} x 
 */
export const getIndexAfterXTyped = (dataPoints, x) => {
    for (let i = 0; i < dataPoints.length / 2; i++) {
        if (dataPoints[i * 2] > x)
            return i
    }
    return dataPoints.length / 2
}

export const throttle = (callback, time) => {
    let running = false
    let callArgs
    let callThis

    const start = () => {
        running = true
        setTimeout(() => {
            running = false
            callback.apply(callThis, callArgs)
        }, time)
    }


    return function (...args) {
        callArgs = args
        callThis = this
        if (!running)
            start()
    }
}

export const getDomainWithOverlap = (domain) => {
    const delta = (domain[1] - domain[0]) * 0.20 // 20 % overlap on each side
    return [domain[0] - delta, domain[1] + delta]
}

/**
 * Returns the size of the overlap of the two domains
 * @param {*} domain1 
 * @param {*} domain2 
 */
export const getOverlappingArea = (domain1, domain2) => {
    const left = Math.max(domain1[0], domain2[0])
    const right = Math.min(domain1[1], domain2[1])
    const area = right - left
    if (area < 0)
        return 0
    return area
}

/**
 * Returns the size of the provided domain
 * @param {*} domain 
 */
export const getArea = (domain) => {
    const area = domain[1] - domain[0]
    if (area < 0)
        return 0
    return area
}
