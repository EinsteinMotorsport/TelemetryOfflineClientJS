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
    const domainSize = domainX[1] - domainX[0]
    const request = {
        channel,
        domainX,
        resolution: domainSize / innerWidth
    }
    
    // Drawing is done in an OffscreenCanvas
    const { 
        offscreenCanvas, 
        offscreenRequest, // The request that was rendered in the OffscreenCanvas
        fullyLoaded 
    } = useOffscreenCanvasLine({
        request,
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

        const curXScaler = scaleLinear()
            .range([0, innerWidth])
            .domain(domainX)

        const offscreenXScaler = scaleLinear()
            .range([0, innerWidth])
            .domain(offscreenRequest.domainX)

        context.resetTransform()
        context.clearRect(0, 0, context.canvas.width, context.canvas.height)

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
