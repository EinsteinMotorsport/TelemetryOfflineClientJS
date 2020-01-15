import React from 'react'
import styled from 'styled-components'
import { scaleLinear } from 'd3-scale'
import useChannelData from '../../hooks/useChannelData'
import { getClosestDataPoint } from '../../util'

const Line = styled.div.attrs(props => ({
    style: { // Use style attribute to improve performance. See Brush.js
        top: props.posY + 'px',
    }
}))`
    position: absolute;
    left: 0;
    height: 1px;
    right: 0;
    background-color: #ffffff;
    z-index: 100;
`

/**
 * Shows a horizontal line at the desired y position on the graph
 */
const HorizontalCursor = ({
    channel,
    left,
    cursorX,
    innerHeight,
    domainY
}) => {

    const yScaler = scaleLinear()
        .range([innerHeight, 0])
        .domain(domainY)

    const { channelData, fullyLoaded } = useChannelData({
        channel,
        domainX: [cursorX, cursorX],
        resolution: 0
    })

    if (!fullyLoaded)
        return null

    const point = getClosestDataPoint(channelData, cursorX)

    return point &&
        <Line posY={yScaler(point.value)} />
}

export default HorizontalCursor
