import React from 'react'
import styled from 'styled-components'
import { scaleLinear } from 'd3-scale'
import useChannelData from '../../hooks/useChannelData'
import { getClosestDataPoint } from '../../util'

const Pane = styled.div`
    position: absolute;
    display: inline-block;
    left: 50px;
    top: 50px;
    background-color: rgba(255, 255, 255, 0.5);
    z-index: 100;
    color: #000000;
    font-size: 0.6rem;

`

/**
 * Shows the time and value of the Point nearest to the mouse cursor
 */
const ValueCursor = ({
    channel,
    cursorX
}) => {

    const { channelData, fullyLoaded } = useChannelData({
        channel,
        domainX: [cursorX, cursorX],
        resolution: 0
    })

    if (!fullyLoaded)
        return null

    const point = getClosestDataPoint(channelData, cursorX)

    return point &&
        <Pane>
            Time: {point.time}
            <br/>
            Value: {point.value}
        </Pane>
}

export default ValueCursor
