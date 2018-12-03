import React from 'react'
import styled from 'styled-components'
import { axisBottom } from 'd3-axis'
import { select } from 'd3-selection'

const StyledAxis = styled.g`
    color: #ffffff;
`

export default ({
    innerHeight,
    xScaler
}) => {

    const xAxis = axisBottom(xScaler)
        .ticks(15, '4s')
        .tickSize(6)

    return (
        <StyledAxis transform={`translate(0,${innerHeight})`} ref={node => select(node).call(xAxis)} />
    )
}
