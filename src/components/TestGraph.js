import React from 'react'
import LineGraph from './LineGraph';

export default ({
    width,
    height,
    id,
    value,
    channel,
    cursorX,
    setCursorX,
    range
}) => (
        <LineGraph id={id} width={width} height={height} range={range} dataPoints={value.channelData[channel]} setCursorX={setCursorX} cursorX={cursorX} />
    )
