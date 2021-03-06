import React from 'react'

import Line from './Line'
import XAxis from './XAxis'
import YAxis from './YAxis'
import HorizontalCursor from './HorizontalCursor'
import ValueCursor from './ValueCursor'

const Graph = ({
    channel,
    innerWidth,
    innerHeight,
    domainX,
    domainY,
    color,
    marginLeft,
    marginBottom,
    cursorX
}) => {

    if (!color)
        color = 'red'

    return (
        <>
            <Line channel={channel} posX={marginLeft} posY={0} innerWidth={innerWidth} innerHeight={innerHeight} domainX={domainX} domainY={domainY} color={color} />
            <XAxis posX={marginLeft} posY={innerHeight} width={innerWidth} height={marginBottom} extendLeft={marginLeft} domainX={domainX} />
            <YAxis posX={0} posY={0} width={marginLeft} height={innerHeight} extendBottom={marginBottom} domainY={domainY} />
            <HorizontalCursor channel={channel} left={marginLeft} cursorX={cursorX} innerHeight={innerHeight} domainY={domainY} />
            <ValueCursor channel={channel} cursorX={cursorX} />
        </>
    )
}

/**
 * Decides whether to rerender the component
 * Prevent unnecessary rerenders
 */
const areEqual = (prevProps, nextProps) => {
    const keys = Object.keys(nextProps)
    if (keys.length !== Object.keys(prevProps).length)
        return false

    return keys.every(key => {
        if (key === 'domainX' || key === 'domainY') { // Bei diesen beiden Props den wirklichen Inhalt, also Index 0 und 1 vergleichen
            return prevProps[key][0] === nextProps[key][0] && prevProps[key][1] === nextProps[key][1]
        } else { // Ansonsten ist es ein shallow compare/identity compare
            return prevProps[key] === nextProps[key]
        }
    })
}

export default React.memo(Graph, areEqual)
