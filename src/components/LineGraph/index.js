import React from 'react'
import styled from 'styled-components'
import { select, mouse } from 'd3-selection'
import { scaleLinear } from 'd3-scale'

import { extent } from 'd3-array'

import withReduxAccelerator from '../../containers/withReduxAccelerator'
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
        overview: false,
        dataSeries: [],
        ...settings
    }

    // Bei Overview-Graph gesamten Bereich anzeigen
    const displayedDomainX = settings.overview ? [0, totalDuration] : domainX

    const xScaler = scaleLinear()
        .range([0, innerWidth])
        .domain(displayedDomainX)

    /*const yScaler = scaleLinear()
        .range([innerHeight, 0])
        .domain(settings.domainY)*/

    let svgRef = null

    const setSvgRef = ref => {
        svgRef = ref
        select(ref)
            .on('mousemove', updateCursorX)
    }

    const updateCursorX = () => {
        const coords = mouse(svgRef)
        const xPos = xScaler.invert(coords[0] - margin.left)
        setCursorX(xPos)
    }

    const StyledLine = styled.line`
        stroke-width: 1;
        stroke: #ffffff;
    `
    const x = xScaler(cursorX)

    const clipId = 'lineGraph-clipid' + id

    return (
        <svg height={height} width={width} ref={setSvgRef} >
            <g transform={`translate(${margin.left}, ${margin.top})`}>
                {
                    // Für jede dataSeries ein Graph
                    settings.dataSeries.map((series, index) => {
                        const dataPoints = channelData[series.channel]
                        const domainY = series.domainY || extent(dataPoints, d => d.value)
                        return <Graph key={index} dataPoints={dataPoints} clipId={clipId} innerWidth={innerWidth} innerHeight={innerHeight} domainX={displayedDomainX} domainY={domainY} color={series.color} />
                    })
                }
                <StyledLine x1={x} x2={x} y1={-margin.top} y2={height} />
                {//<CrossHair dataPoints={settings.dataSeries.map(series => channelData[series.channel])} xScaler={xScaler} x={cursorX} innerHeight={innerHeight} innerWidth={innerWidth} />
                }

                {settings.overview &&
                    <Brush domainX={domainX} setDomainX={setDomainX} innerHeight={innerHeight} innerWidth={innerWidth} xScaler={xScaler} />}
            </g>

            <defs>
                <clipPath id={clipId}>
                    <rect width={innerWidth} height={innerHeight} />
                </clipPath>
            </defs>
        </svg>
    )
}

export default /*withReduxAccelerator(*/LineGraph/*, {
    selection: {
        cursorX: 50
    }
})*/
