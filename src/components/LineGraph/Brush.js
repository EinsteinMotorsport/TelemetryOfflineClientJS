import React, { useRef, useEffect } from 'react'
import styled from 'styled-components'
import { scaleLinear } from 'd3-scale'

/**
 * Complete surface of the graph to be able to drag the brush to every position
 */
const BrushArea = styled.div`
    position: absolute;
    top: 0;
    left: ${props => props.left}px;
    height: ${props => props.height}px;
    right: 0;
`

/**
 * Selected area
 */
const BrushSelection = styled.div.attrs(props => ({
    /*
        Use style attribute for left and width css attribute to improve performance
        otherwise a new css class is generated on each change of the properties. See 
        See https://github.com/styled-components/styled-components/issues/134#issuecomment-312415291
    */
    style: {
        left: `${props.left}px`,
        width: `${props.width}px`
    }
}))`
    position: absolute;
    top: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.2);
    border: 1px solid #ffffff;
    box-sizing: border-box;
`

const BrushHandleCenter = styled.div`
    cursor: move;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
`

const BrushHandle = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    width: 6px;
    cursor: ew-resize;
    z-index: 10;
`

const BrushHandleLeft = styled(BrushHandle)`
    left: -3px;
`

const BrushHandleRight = styled(BrushHandle)`
    right: -3px;
`

// Todo in nicht markierten Bereich klicken und auswählen

/**
 * Domain-Selektor: Markiert Bereich in Overview LineGraph
 */
const Brush = ({
    left,
    displayedDomainX,
    brushDomainX,
    setDomainX,
    innerHeight,
    innerWidth
}) => {

    const displayedXScaler = scaleLinear()
        .range([0, innerWidth])
        .domain(displayedDomainX)

    const mouseX = useRef(null)
    const moveHandle = useRef(null)

    useEffect(() => {
        const mouseUp = () => moveHandle.current = null
        window.addEventListener('mouseup', mouseUp)
        return () => window.removeEventListener('mouseup', mouseUp)
    }, [])

    useEffect(() => {
        const mouseMove = event => {
            if (moveHandle.current !== null) { // Mouse was pressed previously
                const delta = displayedXScaler.invert(event.pageX - mouseX.current) // Calc delta in channel time unit
                mouseX.current = event.pageX
                const domainX = [...brushDomainX]
                if (moveHandle.current === 'right') { // right handle (extend right)
                    domainX[1] += delta
                    domainX[1] = Math.min(domainX[1], displayedDomainX[1]) // Not greater than totalDuration
                    domainX[1] = Math.max(domainX[1], domainX[0]) // Not less than left domain boundary

                } else if (moveHandle.current === 'left') { // left handle (extend left)
                    domainX[0] += delta
                    domainX[0] = Math.max(domainX[0], displayedDomainX[0]) // Not less than 0
                    domainX[0] = Math.min(domainX[0], domainX[1]) // Not greater than right domain boundary

                } else if (moveHandle.current === 'center') { // center handle (move)
                    domainX[0] += delta
                    domainX[1] += delta
                    if (domainX[0] < displayedDomainX[0]) { // Prevent moving out of displayed area
                        domainX[1] -= domainX[0] - displayedDomainX[0]
                        domainX[0] = displayedDomainX[0]
                    }
                    if (domainX[1] > displayedDomainX[1]) {
                        domainX[0] -= domainX[1] - displayedDomainX[1]
                        domainX[1] = displayedDomainX[1]
                    }
                }
                setDomainX(domainX)
            }
        }
        window.addEventListener('mousemove', mouseMove)
        return () => window.removeEventListener('mousemove', mouseMove)
    }, [brushDomainX, displayedDomainX, displayedXScaler, setDomainX])

    const leftMouseDown = event => {
        mouseX.current = event.pageX
        moveHandle.current = 'left'
    }

    const rightMouseDown = event => {
        mouseX.current = event.pageX
        moveHandle.current = 'right'
    }

    const centerMouseDown = event => {
        mouseX.current = event.pageX
        moveHandle.current = 'center'
    }

    return (
        <BrushArea
            left={left}
            height={innerHeight}
        >
            <BrushSelection
                left={displayedXScaler(brushDomainX[0])}
                width={displayedXScaler(brushDomainX[1] - brushDomainX[0])}
            >
                <BrushHandleLeft onMouseDown={leftMouseDown} />
                <BrushHandleCenter onMouseDown={centerMouseDown} />
                <BrushHandleRight onMouseDown={rightMouseDown} />
            </BrushSelection>
        </BrushArea>
    )
}

export default Brush
