import React from 'react'

import { select, mouse } from 'd3-selection'
import { scaleLinear } from 'd3-scale'

import { extent } from 'd3-array'

import Graph from './Graph'
import CrossHair from './CrossHair'
import Brush from './Brush'

const LineGraph = ({
    id,
    width,
    height,
    settings,
    setSettings,
    selection: {
        domainX,
        setDomainX,
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

    const dataPoints = channelData[settings.channel]

    if (!dataPoints) {
        return (
            <div>No Channel Data found for Channel '{settings.channel}'</div>
        )
    }

    // Bei Overview-Graph gesamten Bereich anzeigen
    const displayedDomainX = settings.overview ? [0, totalDuration] : domainX
    const domainY = extent(dataPoints, d => d.value)

    const xScaler = scaleLinear()
        .range([0, innerWidth])
        .domain(displayedDomainX)

    const yScaler = scaleLinear()
        .range([innerHeight, 0])
        .domain(domainY)


    const updateCursorX = (node) => {
        const coords = mouse(node)
        const xPos = xScaler.invert(coords[0] - margin.left)
        setCursorX(xPos)
    }


    const clipId = 'lineGraph-clipid' + id

    return (
        <svg height={height} width={width} ref={node => select(node).on('mousemove', updateCursorX.bind(null, node))}> { /* TODO direkt in JSX schreiben als onMouseMove */}
            <g transform={`translate(${margin.left}, ${margin.top})`}>
                <Graph dataPoints={dataPoints} clipId={clipId} innerWidth={innerWidth} innerHeight={innerHeight} domainX={displayedDomainX} domainY={domainY} color={settings.color} />
                <CrossHair dataPoints={dataPoints} xScaler={xScaler} yScaler={yScaler} x={cursorX} innerHeight={innerHeight} innerWidth={innerWidth} />
                { settings.overview && 
                    <Brush domainX={domainX} setDomainX={setDomainX} innerHeight={innerHeight} innerWidth={innerWidth} xScaler={xScaler} /> }
            </g>

            <defs>
                <clipPath id={clipId}>
                    <rect width={innerWidth} height={innerHeight} />
                </clipPath>
            </defs>
        </svg>
    )
}

export default LineGraph
