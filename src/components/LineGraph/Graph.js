import React from 'react'

import { scaleLinear } from 'd3-scale'

import { getIndexBeforeX } from '../../util/'

import Line from './Line'
import XAxis from './XAxis'
import YAxis from './YAxis'
import DataSupplier from '../../containers/DataSupplier'

const Graph = ({
    channel,
    clipId,
    innerWidth,
    innerHeight,
    domainX,
    domainY,
    color
}) => {

    if (!color)
        color = 'red'

    const xScaler = scaleLinear()
        .range([0, innerWidth])
        .domain(domainX)

    const yScaler = scaleLinear()
        .range([innerHeight, 0])
        .domain(domainY)

    return (
        <DataSupplier channel={channel}  domainX={domainX} resolution={innerWidth / 2} >
            {dataPoints =>
                <>
                    <Line dataPoints={dataPoints} innerWidth={innerWidth} innerHeight={innerHeight} domainX={domainX} domainY={domainY} color={color} clipId={clipId} />
                    <XAxis xScaler={xScaler} innerHeight={innerHeight} />
                    <YAxis yScaler={yScaler} />
                </>
            }
        </DataSupplier>
    )
}

/**
 * Entscheidet ob die Component neu gerendert werden muss
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
