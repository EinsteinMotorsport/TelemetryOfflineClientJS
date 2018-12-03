import React from 'react'
import styled from 'styled-components'

import { getClosestDataPoint } from '../util'


const StyledDiv = styled.div`
    height: 100%;
    overflow: auto;
`

const StyledTable = styled.table`
    width: 100%;
`

const StyledTD = styled.td`
    width: 30%;
`

const ValueTD = styled(StyledTD)`
    text-align: right;
`

export default ({
    data: {
        channelData,
        channelDefinitions
    },
    selection: {
        cursorX
    }
}) => {
    // TODO das macht irgendwie Perf-Probleme
    return (
        <StyledDiv>
            <StyledTable>
                <tbody>
                    <tr>
                        <th>Channel</th>
                        <th colSpan={2}>Value</th>
                    </tr>
                    {
                        channelDefinitions.map(channel => {
                            const dataPoint = getClosestDataPoint(channelData[channel.id], cursorX)
                            return (
                                <tr key={channel.id}>
                                    <StyledTD>{channel.name}</StyledTD>
                                    <ValueTD>{dataPoint ? dataPoint.value.toFixed(3) : '–'}</ValueTD>
                                    <StyledTD>{channel.unit}</StyledTD>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </StyledTable>
        </StyledDiv>
    )
}
