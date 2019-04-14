import React from 'react'
import styled from 'styled-components'

const StyledCanvas = styled.canvas`
    position: absolute;
    left: ${props => props.posX}px;
    top: ${props => props.posY}px;
    width: ${props => props.cssWidth}px;
    height: ${props => props.cssHeight}px;
`

const ScaledCanvas = ({
    posX,
    posY,
    width,
    height,
    draw
}) => {

    const ratio = window.devicePixelRatio || 1

    const ref = canvas => {
        if (!canvas) // if was unmounted
            return

        const context = canvas.getContext('2d')
        context.resetTransform()
        context.scale(ratio, ratio)
        draw(context)
    }
    
    
    return <StyledCanvas
        posX={posX}
        posY={posY}
        cssWidth={width}
        cssHeight={height}
        width={width * ratio}
        height={height * ratio}
        ref={ref}
    />
}

export default ScaledCanvas
