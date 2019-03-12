import React from 'react'
import styled from 'styled-components'
import { select, mouse } from 'd3-selection'
import { line, curveStep } from 'd3-shape'
import { scaleLinear } from 'd3-scale'

import { extent } from 'd3-array'

import Graph from './Graph'
import CrossHair from './CrossHair'
import Brush from './Brush'
import dataManager from '../../managers/dataManager'

const StyledLine = styled.line`
        stroke-width: 1;
        stroke: #ffffff;
`

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

    // TODO
    const totalDuration = dataManager.getTotalDuration()

    // Bei Overview-Graph gesamten Bereich anzeigen
    const displayedDomainX = settings.overview ? [0, totalDuration] : domainX

    const xScaler = scaleLinear()
        .range([0, innerWidth])
        .domain(displayedDomainX)


    /*const updateCursorX = () => {
        const coords = mouse(svgRef)
        const xPos = xScaler.invert(coords[0] - margin.left)
        setCursorX(xPos)
    }*/

    const x = xScaler(cursorX)

    return (
        <div>
            {
                // Für jede dataSeries ein Graph
                settings.dataSeries.map((series, index) => {
                    //const dataPoints = channelData[series.channel]
                    const domainY = series.domainY || [0, 1e5]//|| extent(dataPoints, d => d.value)
                    return <Graph key={index} channel={series.channel} innerWidth={innerWidth} innerHeight={innerHeight} domainX={displayedDomainX} domainY={domainY} color={series.color} />
                })
            }
            <StyledLine x1={x} x2={x} y1={-margin.top} y2={height} />
            {//<CrossHair dataPoints={settings.dataSeries.map(series => channelData[series.channel])} xScaler={xScaler} x={cursorX} innerHeight={innerHeight} innerWidth={innerWidth} />
            }

            {settings.overview &&
                <Brush domainX={domainX} setDomainX={setDomainX} innerHeight={innerHeight} innerWidth={innerWidth} xScaler={xScaler} />}

        </div>
    )
}

export default /*withReduxAccelerator(*/LineGraph/*, {
    selection: {
        cursorX: 50
    }
})*/
