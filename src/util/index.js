import { bisector } from 'd3-array'

export const getIndexBeforeX = (dataPoints, x) => {
    const bisect = bisector(d => d.time).left
    return bisect(dataPoints, x) - 1
}

// TODO soll wirklich der Punkt verwendet werden, der am nahesten dran ist?
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
