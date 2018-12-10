import React from 'react'
import styled from 'styled-components'
import { axisLeft } from 'd3-axis'
import { select } from 'd3-selection'

const StyledAxis = styled.g`
    color: #ffffff;
`

const YAxis = ({
    yScaler
}) => {

    const yAxis = axisLeft(yScaler)
        .ticks(7, '3s')

    return (
        <StyledAxis ref={node => yAxis(select(node))} />
    )
}

export default YAxis
