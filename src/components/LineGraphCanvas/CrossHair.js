import React from 'react'
import styled from 'styled-components'

import { getClosestDataPoint } from '../../util'

const StyledLine = styled.line`
    stroke-width: 1;
    stroke: #ffffff;
`

/**
 * Zeigt Fadenkreuz an Mausposition an
 */
const CrossHair = ({
    dataPoints,
    xScaler,
    yScaler,
    x,
    innerHeight,
    innerWidth
}) => {
    if (x == null)
        return null

    const closestPoint = getClosestDataPoint(dataPoints, x)

    const posX = xScaler(closestPoint.time)
    const posY = yScaler(closestPoint.value)

    return (
        <>
            <StyledLine x1={posX} x2={posX} y1={0} y2={innerHeight} />
            <StyledLine x1={0} x2={innerWidth} y1={posY} y2={posY} />
            <circle cx={posX} cy={posY} r={2} />
        </>
    )
}

export default CrossHair
