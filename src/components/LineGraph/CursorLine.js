import React from 'react'
import styled from 'styled-components'
import { scaleLinear } from 'd3-scale'

const Line = styled.div`
    position: absolute;
    left: ${props => props.posX - 1}px;
    top: 0;
    width: 2px;
    bottom: 0;
    background-color: #ffffff;
`

/**
 * Shows a Cross Hair at the desired x position on the graph
 */
const CrossHair = ({
    left,
    posX,
    innerWidth,
    domainX
}) => {

    const xScaler = scaleLinear()
        .range([0, innerWidth])
        .domain(domainX)

    return (
        <Line posX={left + xScaler(posX)} />
    )
}

export default CrossHair
