import React from 'react'
import styled from 'styled-components'

import { select, mouse } from 'd3-selection'
import { axisBottom, axisLeft, } from 'd3-axis'
import { scaleLinear } from 'd3-scale'
import { line, curveMonotoneX } from 'd3-shape'
import { extent } from 'd3-array'
import { bisector } from 'd3-array'

const StyledPath = styled.path`
    stroke: ${props => props.color};
    fill: none;
    stroke-width: 2px;
    clip-path: url(#${props => props.clipId});
`

const StyledAxis = styled.g`
    color: #ffffff;
`

export default ({
    id,
    width,
    height,
    range,
    dataPoints,
    cursorX,
    setCursorX
}) => {
    const margin = { top: 20, right: 20, bottom: 20, left: 40 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const x = scaleLinear()
        .range([0, innerWidth])
        .domain(range)

    const y = scaleLinear()
        .range([innerHeight, 0])
        .domain(extent(dataPoints, d => d.value))

    const xAxis = axisBottom(x)
        .ticks(15, '4s')
        .tickSize(6)

    const yAxis = axisLeft(y)
        .ticks(7, '3s')

    const valueLine = line()
        .curve(curveMonotoneX)
        .x(d => x(d.time))
        .y(d => y(d.value))

    const linePath = valueLine(dataPoints)

    const updateCursorX = (node) => {
        const coords = mouse(node)
        const xPos = x.invert(coords[0] - margin.left)
        setCursorX(xPos)
    }


    const clipId = 'lineGraph-clipid' + id

    const bisect = bisector(function(d) { return d.time; }).left
    const index = bisect(dataPoints, cursorX)
    const before = dataPoints[index - 1]
    const after = dataPoints[index]
    const item = Math.abs(before.time - cursorX) < Math.abs(after.time - cursorX) ? before : after

    return (
        <svg height={height} width={width} ref={node => select(node).on('mousemove', updateCursorX.bind(null, node))}>
            <g transform={`translate(${margin.left}, ${margin.top})`}>
                <StyledPath d={linePath} color={'orange'} clipId={clipId} />
                <StyledAxis transform={`translate(0,${innerHeight})`} ref={node => select(node).call(xAxis)} />
                <StyledAxis ref={node => yAxis(select(node))} />
                <circle cx={x(item.time)} cy={y(item.value)} r={5} />
            </g>

            <defs>
                <clipPath id={clipId}>
                    <rect width={innerWidth} height={innerHeight} />
                </clipPath>
            </defs>
        </svg>
    )
}
