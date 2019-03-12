import React from 'react'
import { scaleLinear } from 'd3-scale'

import ScaledCanvas from '../ScaledCanvas'

const XAxis = ({
    posX,
    posY,
    extendLeft,
    width,
    height,
    domainX
}) => {

    const xScaler = scaleLinear()
        .range([0, width])
        .domain(domainX)

    const tickSize = 6
    const ticks = xScaler.ticks(20) // 20 Ticks
    const tickFormat = xScaler.tickFormat()

    const draw = context => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height)

        context.strokeStyle = 'white'
        context.fillStyle = 'white'

        context.beginPath()
        context.moveTo(extendLeft, 0)
        context.lineTo(extendLeft + width, 0)
        context.stroke()

        context.beginPath()
        ticks.forEach(d => {
            context.moveTo(extendLeft + xScaler(d), 0)
            context.lineTo(extendLeft + xScaler(d), tickSize)
        })
        context.stroke()

        context.textAlign = 'center'
        context.textBaseline = 'top'
        ticks.forEach(d => 
            context.fillText(tickFormat(d), extendLeft + xScaler(d), tickSize))
    }

    return (
        <ScaledCanvas
            posX={posX - extendLeft}
            posY={posY}
            width={width + extendLeft}
            height={height}
            draw={draw} />
    )
}

export default XAxis
