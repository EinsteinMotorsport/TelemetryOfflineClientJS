import React from 'react'
import styled from 'styled-components'
import { line, curveMonotoneX } from 'd3-shape'

const StyledPath = styled.path`
    stroke: ${props => props.color};
    fill: none;
    stroke-width: 2px;
    clip-path: url(#${props => props.clipId});
`

export default ({
    dataPoints,
    xScaler,
    yScaler,
    color,
    clipId
}) => {

    const valueLine = line()
        .curve(curveMonotoneX)
        .x(d => xScaler(d.time))
        .y(d => yScaler(d.value))

    const linePath = valueLine(dataPoints)

    return (
        <StyledPath d={linePath} color={color} clipId={clipId} />
    )
}
