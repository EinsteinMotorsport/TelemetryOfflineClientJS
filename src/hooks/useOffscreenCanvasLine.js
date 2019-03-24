import { useMemo, useRef } from 'react'
import useChannelData from './useChannelData'
import { line } from 'd3-shape'
import { scaleLinear } from 'd3-scale'

const useOffscreenCanvasLine = ({
    channel,
    innerWidth,
    innerHeight,
    pixelRatio,
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

    const domainYFrom = domainY[0]
    const domainYTo = domainY[1]

    const { fullyLoaded, channelData } = useChannelData(request)
    
    // The request that was drawn on the OfscreenCanvas
    const offscreenXScaler = useRef(null)

    // TOdo WebGL wäre auch eine Möglichkeit
    const offscreenImage = useMemo(() => {
        if (channelData.length === 0) {
            offscreenXScaler.current = null
            return
        }
        
        console.time("offscreen-draw")

        const requestedXScaler = scaleLinear()
            .range([0, innerWidth])
            .domain(domainX)

        const yScaler = scaleLinear()
            .range([innerHeight, 0])
            .domain([domainYFrom, domainYTo])

        // Every DataPoint present in the channelData array is drawn, therefore the size can be different each time
        const minTime = channelData[0].time
        const maxTime = channelData[channelData.length - 1].time
        const offset = requestedXScaler(minTime)
        const width = (requestedXScaler(maxTime) - offset)
        const canvas = new OffscreenCanvas(width * pixelRatio, innerHeight * pixelRatio)

        //console.log(`Canvas ${canvas.width}x${canvas.height}`)

        const newXScaler = scaleLinear()
            .range([0, width])
            .domain([minTime, maxTime])

        const valueLine = line()
            .x(d => newXScaler(d.time))
            .y(d => yScaler(d.value))
        

        offscreenXScaler.current = newXScaler

        const offContext = canvas.getContext('2d')

        offContext.resetTransform()
        offContext.scale(pixelRatio, pixelRatio) // For high resultion rendering (Retina displays)

        const contextedValueLine = valueLine
            .context(offContext)

        offContext.clearRect(0, 0, offContext.canvas.width, offContext.canvas.height)

        offContext.beginPath()
        contextedValueLine(channelData)
        offContext.lineWidth = 2
        offContext.strokeStyle = color
        offContext.stroke()

        console.timeEnd("offscreen-draw")
        return canvas.transferToImageBitmap()

    }, [channelData, domainYFrom, domainYTo, color, innerWidth, innerHeight, pixelRatio])
    // TODO testen ob die Messserte auch an der richtigen Stelle dargestellt werden

    return {
        offscreenImage,
        offscreenXScaler: offscreenXScaler.current,
        fullyLoaded
    }
}

export default useOffscreenCanvasLine
