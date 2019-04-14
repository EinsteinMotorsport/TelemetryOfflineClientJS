import React from 'react'
import { scaleLinear } from 'd3-scale'

import ScaledCanvas from '../ScaledCanvas'

const YAxis = ({
    posX,
    posY,
    extendBottom,
    width,
    height,
    domainY
}) => {

    const yScaler = scaleLinear()
        .range([height, 0])
        .domain(domainY)

    const tickSize = 6
    const ticks = yScaler.ticks(20) // 20 ticks
    const tickFormat = yScaler.tickFormat()

    const draw = context => {
        const xEnd = width -1

        context.clearRect(0, 0, context.canvas.width, context.canvas.height)

        context.strokeStyle = 'white'
        context.fillStyle = 'white'

        context.beginPath()
        context.moveTo(xEnd, 0)
        context.lineTo(xEnd, height)
        context.stroke()

        context.beginPath()
        ticks.forEach(d => {
            context.moveTo(xEnd, yScaler(d))
            context.lineTo(xEnd - tickSize, yScaler(d))
        })
        context.stroke()

        context.textAlign = 'right'
        context.textBaseline = 'middle'
        ticks.forEach(d => 
            context.fillText(tickFormat(d), xEnd - tickSize, yScaler(d)))
    }

    return (
        <ScaledCanvas
            posX={posX}
            posY={posY}
            width={width}
            height={height + extendBottom}
            draw={draw} />
    )
}

export default YAxis
