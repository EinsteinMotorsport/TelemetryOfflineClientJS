import React from 'react'
import styled from 'styled-components'


export default ({
    id,
    width,
    height,
    range,
    value,
    cursorX
}) => {

    return (
        <table>
            <tbody>
                <tr>
                    <th>Channel {cursorX}</th>
                    <th>Value</th>
                </tr>
                {
                    value.channelDefinitions.map(channel => {
                        const dataPoint = value.channelData[channel.id][cursorX]
                        return (
                            <tr key={channel.id}>
                                <td>{channel.name}</td>
                                <td>{dataPoint ? dataPoint.value : '–'}</td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}
