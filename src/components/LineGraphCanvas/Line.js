import React from 'react'
import { scaleLinear } from 'd3-scale'

import ScaledCanvas from '../ScaledCanvas'
import useOffscreenCanvasLine from '../../hooks/useOffscreenCanvasLine';

const pixelRatio = window.devicePixelRatio || 1

const Line = ({
    channel,
    innerWidth,
    innerHeight,
    posX,
    posY,
    domainX,
    domainY,
    color
}) => {

    // Drawing is done in an OffscreenCanvas
    const { 
        offscreenCanvas, 
        offscreenXScaler, // The request that was rendered in the OffscreenCanvas
        fullyLoaded 
    } = useOffscreenCanvasLine({
        channel,
        innerWidth,
        innerHeight,
        pixelRatio,
        domainX,
        domainY,
        color
    })

    // TODO requestAnimationFrame verwenden?
    /**
     * Copy the content of the OffscreenCanvas to the actual canvas with the required translation and scaling
     * @param {*} context 
     */
    const draw = context => {
        console.log("Draw")

        context.resetTransform()
        context.clearRect(0, 0, context.canvas.width, context.canvas.height)

        if (offscreenXScaler === null) // Wenn es nichts zum Anzeigen gibt, dann soll auch nichts angezeigt werden
            return

        const curXScaler = scaleLinear()
            .range([0, innerWidth])
            .domain(domainX)

        const translateX = offscreenXScaler(curXScaler.invert(0))
        const scaleX = offscreenXScaler(curXScaler.invert(1)) - translateX

        context.drawImage(offscreenCanvas, translateX * pixelRatio, 0, scaleX * context.canvas.width, context.canvas.height, 0, 0, context.canvas.width, context.canvas.height)
    }

    return (
        <>
            <ScaledCanvas
                width={innerWidth}
                height={innerHeight}
                posX={posX}
                posY={posY}
                draw={draw} />
            {!fullyLoaded && 
                <div>Loading</div>
            }
        </>
    )
}

export default Line
