import React, { Component, useState, useMemo } from 'react'
import styled from 'styled-components'
import { line, curveStep } from 'd3-shape'
import { scaleLinear } from 'd3-scale'
import memoize from 'memoize-one'

import { getDomainWithOverlap } from '../../util'
import { render } from 'react-dom';
import ScaledCanvas from '../ScaledCanvas'
import useChannelData from '../../hooks/useChannelData'

let id

const ratio = window.devicePixelRatio || 1

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

    const xScaler = scaleLinear()
        .range([0, innerWidth])
        .domain(domainX)

    const yScaler = scaleLinear()
        .range([innerHeight, 0])
        .domain(domainY)

    const valueLine = line()
        .x(d => xScaler(d.time))
        .y(d => yScaler(d.value))

    const domainSize = domainX[1] - domainX[0]

    const request = {
        channel,
        domainX,
        resolution: domainSize / innerWidth
    }

    const { fullyLoaded, channelData } = useChannelData(request)
    //console.log("Line ", channelData)

    const [offsetCanvasRequest, setOffsetCanvasRequest] = useState()

    const drawOffsetCanvas = () => {
        console.log("Offscreen Draw")
        if (channelData === null)
            return

        const offContext = offscreenCanvas.getContext('2d')

        offContext.resetTransform()
        offContext.scale(ratio, ratio)


        const contextedValueLine = valueLine
            .context(offContext)

        offContext.clearRect(0, 0, offContext.canvas.width, offContext.canvas.height)

        offContext.beginPath()
        contextedValueLine(channelData)
        offContext.lineWidth = 1.5
        offContext.strokeStyle = color
        offContext.stroke()
    }

    const offscreenCanvas = useMemo(() => {
        const canvas = document.createElement('canvas')
        const overlap = 0.2 // 20% links und 20% rechts
        canvas.width = (innerWidth + 2 * innerWidth * overlap) * ratio
        canvas.height = innerHeight * ratio
        setOffsetCanvasRequest({
            ...request,
            xScaler
        })
        return canvas
    }, [innerWidth, innerWidth, channelData])

    //console.log(offscreenCanvas)

    //useMemo(() => {
        drawOffsetCanvas()
    //}, [channelData])



    // Todo offscreen Canvas
    const draw = context => {
        //console.time("canvasRender")
        const xScaler = scaleLinear()
            .range([0, innerWidth])
            .domain(domainX)




        console.log("Rendern", channelData.length + " Punkte")

        /*context.lineWidth = 1.5
        context.strokeStyle = color
        context.beginPath()


        dataPoints.slice(0, 1500).forEach((point, index) => {
            context.lineTo(xScaler(point.time), yScaler(point.value))
            //context.fillRect(index % 50, Math.floor(index / 50), 10, 10)
        })

        context.stroke()*/

        context.resetTransform()

        context.clearRect(0, 0, context.canvas.width, context.canvas.height)


        const translateX = 0 //offsetCanvasRequest.xScaler(xScaler.invert(0))
        const scaleX = 1 //offsetCanvasRequest.xScaler(xScaler.invert(1)) - translateX
        //console.log(translateX, scaleX)

        context.drawImage(offscreenCanvas, translateX * ratio, 0, scaleX * context.canvas.width, context.canvas.height, 0, 0, context.canvas.width, context.canvas.height)

        //console.timeEnd("canvasRender")
    }

    /*if (props.dataPoints === dataPoints
        && parameters.domainX
        && props.domainX[0] >= parameters.domainX[0]
        && props.domainX[1] <= parameters.domainX[1]
    ) {
        return null
    }*/



    // TODO Memo

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
