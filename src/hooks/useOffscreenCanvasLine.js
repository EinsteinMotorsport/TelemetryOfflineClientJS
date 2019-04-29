import { useMemo, useState } from 'react'
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

    const [status, setStatus] = useState({
        offscrenImage: null,
        offscreenXScaler: null, // The request that was drawn on the OfscreenCanvas
        fullyRendered: false
    })

    const { setTask } = useWorker({ 
        Worker,
        handler(data, done) {
            if (data.offscreenImage === null) { // No image returned because nothing should be displayed
                setStatus({
                    offscrenImage: null,
                    offscreenXScaler: null,
                    fullyRendered: true
                })
            } else {
                setStatus({
                    offscrenImage: data.offscreenImage,
                    offscreenXScaler: scaleLinear()
                        .range([0, data.offscreenWidth])
                        .domain(data.offscreenDomain),
                    fullyRendered: done
                })
            }
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
    // TODO domainY mit einbeziehen in Skalierung in Line

    return {
        offscreenImage: status.offscrenImage,
        offscreenXScaler: status.offscreenXScaler,
        fullyLoaded: fullyLoaded && status.fullyRendered // It's only fully loaded if both the channel data and the offscreen renderer are fully done
    }
}

export default useOffscreenCanvasLine
