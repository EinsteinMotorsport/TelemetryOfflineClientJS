import { bisector } from 'd3-array'

// TODO soll wirklich der Punkt verwendet werden, der am nahesten dran ist?
export const getClosestDataPoint = (dataPoints, x) => {
    const bisect = bisector(d => d.time).left
    const index = bisect(dataPoints, x)
    const before = dataPoints[index - 1]
    const after = dataPoints[index]
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
