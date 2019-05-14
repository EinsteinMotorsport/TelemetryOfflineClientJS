import React from 'react'
import styled from 'styled-components'
import { scaleLinear } from 'd3-scale'

const Line = styled.div.attrs(props => ({
    style: { // Use style attribute to improve performance. See Brush.js
        left: props.posX - 1 + 'px',
    }
}))`
    position: absolute;
    top: 0;
    width: 2px;
    bottom: 0;
    background-color: #ffffff;
`

/**
 * Shows a vertical line at the desired x position on the graph
 */
const VerticalCursor = ({
    left,
    cursorX,
    innerWidth,
    domainX
}) => {

    const xScaler = scaleLinear()
        .range([0, innerWidth])
        .domain(domainX)

    return (
        <Line posX={left + xScaler(cursorX)} />
    )
}

export default VerticalCursor
