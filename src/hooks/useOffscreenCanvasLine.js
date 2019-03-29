import { useMemo, useRef, useState, useEffect } from 'react'
import useChannelData from './useChannelData'
import { line } from 'd3-shape'
import { scaleLinear } from 'd3-scale'

import Worker from '../worker/OffscreenRenderer.worker'


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

    const [offscreenImage, setOffscreenImage] = useState(null)

    const worker = useRef(null)

    useMemo(() => {
        worker.current = new Worker()
        worker.current.addEventListener('message', event => {
            console.log("From Worker", event)
            setOffscreenImage(event.data.offscreenImage)
            if (event.data.offscreenImage === null) {
                offscreenXScaler.current = null
            } else {
                offscreenXScaler.current = scaleLinear()
                    .range([0, event.data.offscreenWidth])
                    .domain(event.data.offscreenDomain)
            }
        })
        return () => {
            // Todo Worker löschen
        }
    }, [])

    // TOdo WebGL wäre auch eine Möglichkeit
    useMemo(() => {
        worker.current.postMessage({
            type: 'render',
            channelData,
            domainX,
            domainYFrom,
            domainYTo,
            color,
            innerWidth,
            innerHeight,
            pixelRatio
        })

    }, [channelData, domainYFrom, domainYTo, color, innerWidth, innerHeight, pixelRatio])
    // TODO testen ob die Messserte auch an der richtigen Stelle dargestellt werden

    return {
        offscreenImage,
        offscreenXScaler: offscreenXScaler.current,
        fullyLoaded
    }
}

export default useOffscreenCanvasLine
