import { line } from 'd3-shape'
import { scaleLinear } from 'd3-scale'

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
    channelData,
    domainX,
    domainYFrom,
    domainYTo,
    color,
    innerWidth,
    innerHeight,
    pixelRatio
}) {
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
    const minTime = channelData[0].time
    const maxTime = channelData[channelData.length - 1].time
    const offset = requestedXScaler(minTime)
    const width = Math.ceil(requestedXScaler(maxTime) - offset)
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

    const valueLine = line()
        .x(d => newXScaler(d.time))
        .y(d => yScaler(d.value))


    const offContext = canvas.getContext('2d')

    offContext.resetTransform()
    offContext.scale(pixelRatio, pixelRatio) // For high resultion rendering (Retina displays)

    const contextedValueLine = valueLine
        .context(offContext)

    offContext.clearRect(0, 0, offContext.canvas.width, offContext.canvas.height)

    offContext.beginPath()
    contextedValueLine(channelData) // D3 draws channelData
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
