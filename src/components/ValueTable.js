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

/**
 * Zeigt die Werte der ausgewählten Channels an Cursor-Position an
 */
const ValueTable = ({
    selection: {
        cursorX
    },
    settings
}) => {
    return null
    /*settings = { // default values
        channels: [],
        ...settings
    }
    return (
        <StyledDiv>
            <StyledTable>
                <tbody>
                    <tr>
                        <th>Channel</th>
                        <th colSpan={2}>Value</th>
                    </tr>
                    {
                        settings.channels.map(channelId => {
                            const dataPoint = getClosestDataPoint(channelData[channelId], cursorX)
                            const channel = channelDefinitions[channelId]
                            return (
                                <tr key={channelId}>
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
    )*/
}

export default ValueTable
