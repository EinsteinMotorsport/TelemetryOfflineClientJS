import { useMemo, useRef } from 'react'
import useChannelData from './useChannelData'
import { line } from 'd3-shape'
import { scaleLinear } from 'd3-scale'

const useOffscreenCanvasLine = ({
    request,
    innerWidth,
    innerHeight,
    pixelRatio,
    domainX,
    domainY,
    color
}) => {

    const xScaler = scaleLinear()
        .range([0, innerWidth])
        .domain(domainX)

    const yScaler = scaleLinear()
        .range([innerHeight, 0])
        .domain(domainY)

    const valueLine = line()
        .x(d => xScaler(d.time))
        .y(d => yScaler(d.value))

    const { fullyLoaded, channelData } = useChannelData(request)

    // Recreate this canvas if the dimensions change
    const offscreenCanvas = useMemo(() => {
        const canvas = document.createElement('canvas')
        const overlap = 0.2 // 20% links und 20% rechts
        canvas.width = (innerWidth + 2 * innerWidth * overlap) * pixelRatio
        canvas.height = innerHeight * pixelRatio
        return canvas
    }, [innerWidth, innerWidth])
    
    // The request that was drawn on the OfscreenCanvas
    const offscreenRequest = useRef(null)

    useMemo(() => {
        console.log("Offscreen Draw")
        if (channelData === null)
            return

        offscreenRequest.current = request

        const offContext = offscreenCanvas.getContext('2d')

        offContext.resetTransform()
        offContext.scale(pixelRatio, pixelRatio)

        const contextedValueLine = valueLine
            .context(offContext)

        offContext.clearRect(0, 0, offContext.canvas.width, offContext.canvas.height)

        offContext.beginPath()
        contextedValueLine(channelData)
        offContext.lineWidth = 1.5
        offContext.strokeStyle = color
        offContext.stroke()

    }, [channelData, domainY, color])
    // TODO OffscreenCanvas muss mind. so groß wie alle Daten in ChannelData sonst wird was abgeschnitten

    return {
        offscreenCanvas,
        offscreenRequest: offscreenRequest.current,
        fullyLoaded
    }
}

export default useOffscreenCanvasLine
