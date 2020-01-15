import { line } from 'd3-shape'
import { scaleLinear } from 'd3-scale'
import { createChannelDataWrapper } from '../data/ChannelData';

const ctx = self

// Respond to message from parent thread
ctx.addEventListener('message', event => {
    let result
    try {
        result = render(event.data)
    } catch (e) {
        console.error('Worker error', e)
        result = null
    }
    ctx.postMessage(result)
})

function render({
    rawChannelData,
    domainX,
    domainYFrom,
    domainYTo,
    color,
    innerWidth,
    innerHeight,
    pixelRatio
}) {
    const channelData = createChannelDataWrapper(rawChannelData)
    if (channelData.length === 0) {
        return {
            offscreenImage: null
        }
    }

    console.time('offscreen-draw')

    const requestedXScaler = scaleLinear()
        .range([0, innerWidth])
        .domain(domainX)

    const yScaler = scaleLinear()
        .range([innerHeight, 0])
        .domain([domainYFrom, domainYTo])

    // Every DataPoint present in the channelData array is drawn, therefore the size can be different each time
    const minTime = channelData.getTime(0)
    const maxTime = channelData.getTime(channelData.length - 1)
    const offset = requestedXScaler(minTime)
    const width = Math.min(Math.ceil(requestedXScaler(maxTime) - offset), innerWidth * pixelRatio * 5) // Limit to 5x the displayed canvas
    if (width === 0)
        return {
            offscreenImage: null
        }
    const canvas = new OffscreenCanvas(width * pixelRatio, innerHeight * pixelRatio)

    //console.log(`Canvas ${canvas.width}x${canvas.height}`)
    //console.log(`${minTime} bis ${maxTime}`)

    const newXScaler = scaleLinear()
        .range([0, width])
        .domain([minTime, maxTime])

        
    const offContext = canvas.getContext('2d')

    offContext.resetTransform()
    offContext.scale(pixelRatio, pixelRatio) // For high resolution rendering (Retina displays)

    offContext.clearRect(0, 0, offContext.canvas.width, offContext.canvas.height)

    offContext.beginPath()
    if (channelData.length > 0) {
        offContext.moveTo(newXScaler(channelData.getTime(0)), yScaler(channelData.getValue(0)))
        for (let i = 1; i < channelData.length; i++) {
            offContext.lineTo(newXScaler(channelData.getTime(i)), yScaler(channelData.getValue(i)))
        }
    }
    offContext.lineWidth = 2
    offContext.strokeStyle = color
    offContext.stroke()

    console.timeEnd('offscreen-draw')
    return {
        offscreenImage: canvas.transferToImageBitmap(),
        offscreenWidth: width,
        offscreenDomain: [minTime, maxTime]
    }
}

export default null
