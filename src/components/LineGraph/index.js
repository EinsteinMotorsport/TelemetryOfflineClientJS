import React, { useRef } from 'react'
import styled from 'styled-components'
import { scaleLinear } from 'd3-scale'

import Graph from './Graph'
import CursorLine from './CursorLine'
import Brush from './Brush'
import useTotalDuration from '../../hooks/useTotalDuration'

const StyledDiv = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
`

const LineGraph = ({
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
    const margin = { top: 0, right: 0, bottom: 20, left: 40 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    settings = { // Default values
        overview: false,
        dataSeries: [],
        ...settings
    }

    const totalDuration = useTotalDuration()

    // Bei Overview-Graph gesamten Bereich anzeigen
    const displayedDomainX = settings.overview ? [0, totalDuration] : domainX

    const xScaler = scaleLinear()
        .range([0, innerWidth])
        .domain(displayedDomainX)

    const divRef = useRef(null)


    const onMouseMove = event => {
        const x = event.screenX - divRef.current.getBoundingClientRect().x - margin.left
        const xPos = xScaler.invert(x)
        setCursorX(xPos)
    }

    return (
        <StyledDiv onMouseMove={onMouseMove} ref={divRef}>
            {
                // Für jede dataSeries ein Graph
                settings.dataSeries.map((series, index) => {
                    const domainY = series.domainY || [0, 1e5]
                    return <Graph
                        key={index}
                        channel={series.channel}
                        innerWidth={innerWidth}
                        innerHeight={innerHeight}
                        domainX={displayedDomainX}
                        domainY={domainY}
                        color={series.color}
                        marginLeft={margin.left}
                        marginBottom={margin.bottom}
                    />
                })
            }
            {
                cursorX !== null &&
                <CursorLine left={margin.left} posX={cursorX} innerWidth={innerWidth} domainX={displayedDomainX} />
            }
            {
                settings.overview &&
                <Brush left={margin.left} displayedDomainX={displayedDomainX} brushDomainX={domainX} setDomainX={setDomainX} innerHeight={innerHeight} innerWidth={innerWidth} xScaler={xScaler} />
            }
        </StyledDiv>
    )
}

export default LineGraph
