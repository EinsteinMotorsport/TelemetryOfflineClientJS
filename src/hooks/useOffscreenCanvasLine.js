import { useMemo, useRef, useState } from 'react'
import useChannelData from './useChannelData'
import { scaleLinear } from 'd3-scale'

import Worker from '../worker/OffscreenRenderer.worker'
import useWorker from './useWorker'


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
    const fullyRendered = useRef(false)

    const [offscreenImage, setOffscreenImage] = useState(null)

    const { setTask } = useWorker({ 
        Worker,
        handler(data, done) {
            if (data.offscreenImage === null) {
                offscreenXScaler.current = null
            } else {
                offscreenXScaler.current = scaleLinear()
                    .range([0, data.offscreenWidth])
                    .domain(data.offscreenDomain)
            }
            fullyRendered.current = done
            setOffscreenImage(data.offscreenImage)
        }
    })

    // TOdo WebGL wäre auch eine Möglichkeit z.B. http://www.pixijs.com/
    useMemo(() => {
        const task = {
            type: 'render',
            channelData,
            domainX,
            domainYFrom,
            domainYTo,
            color,
            innerWidth,
            innerHeight,
            pixelRatio
        }
        setTask(task)

    }, [channelData, domainYFrom, domainYTo, color, innerWidth, innerHeight, pixelRatio])
    // TODO testen ob die Messserte auch an der richtigen Stelle dargestellt werden

    return {
        offscreenImage,
        offscreenXScaler: offscreenXScaler.current,
        fullyLoaded: fullyLoaded && fullyRendered.current
    }
}

export default useOffscreenCanvasLine
