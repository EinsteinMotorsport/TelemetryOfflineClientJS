import React from 'react'

import { select, mouse } from 'd3-selection'
import { scaleLinear } from 'd3-scale'

import { extent } from 'd3-array'

import Line from './Line'
import XAxis from './XAxis'
import YAxis from './YAxis'
import CrossHair from './CrossHair'

export default ({
    id,
    width,
    height,
    settings,
    setSettings,
    selection: {
        range,
        setRange,
        cursorX,
        setCursorX
    },
    data: {
        channelDefinitions,
        totalDuration,
        channelData
    }
}) => {
    const margin = { top: 20, right: 20, bottom: 20, left: 40 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    settings = { // Default values
        color: 'red',
        overview: false,
        ...settings
    }

    if (settings.overview)
        range = [0, totalDuration]

    const dataPoints = channelData[settings.channel]

    if (!dataPoints) {
        return (
            <div>No Channel Data found for Channel '{settings.channel}'</div>
        )
    }

    const xScaler = scaleLinear()
        .range([0, innerWidth])
        .domain(range)

    const yScaler = scaleLinear()
        .range([innerHeight, 0])
        .domain(extent(dataPoints, d => d.value))


    const updateCursorX = (node) => {
        const coords = mouse(node)
        const xPos = xScaler.invert(coords[0] - margin.left)
        setCursorX(xPos)
    }


    const clipId = 'lineGraph-clipid' + id

    return (
        <svg height={height} width={width} ref={node => select(node).on('mousemove', updateCursorX.bind(null, node))}>
            <g transform={`translate(${margin.left}, ${margin.top})`}>
                <Line dataPoints={dataPoints} xScaler={xScaler} yScaler={yScaler} color={settings.color} clipId={clipId} />
                <XAxis xScaler={xScaler} innerHeight={innerHeight} />
                <YAxis yScaler={yScaler} />
                <CrossHair dataPoints={dataPoints} xScaler={xScaler} yScaler={yScaler} x={cursorX} innerHeight={innerHeight} innerWidth={innerWidth} />
            </g>

            <defs>
                <clipPath id={clipId}>
                    <rect width={innerWidth} height={innerHeight} />
                </clipPath>
            </defs>
        </svg>
    )
}
