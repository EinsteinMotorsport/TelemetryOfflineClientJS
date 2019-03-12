import React, { Component } from 'react'
import styled from 'styled-components'
import { line, curveStep } from 'd3-shape'
import { scaleLinear } from 'd3-scale'

import { getDomainWithOverlap } from '../../util'

const StyledPath = styled.path`
    stroke: ${props => props.color};
    fill: none;
    stroke-width: 2px;
    clip-path: url(#${props => props.clipId});
`

class Line extends Component {

    constructor(props) {
        super(props)
        this.state = {
            parameters: {},
        }
        //this.state = this._generateLine()
        this.setCanvasRef = this.setCanvasRef.bind(this)
    }

    static getDerivedStateFromProps(props, state) {
        if (props.dataPoints === state.dataPoints
            && state.parameters.domainX
            && props.domainX[0] >= state.parameters.domainX[0]
            && props.domainX[1] <= state.parameters.domainX[1]
        ) {
            return null
        }

        return Line._generateLine(props)

    }

    static _generateLine(props) {
        if (props.dataPoints === null) {
            return {
                loading: true
            }
        }

        const domainX = getDomainWithOverlap(props.domainX)
        //const domainY = this._getDomainWithOverlap(this.props.domainY)

        const xScaler = scaleLinear()
            .range([0, props.innerWidth])
            .domain(domainX)

        const yScaler = scaleLinear()
            .range([props.innerHeight, 0])
            .domain(props.domainY)

        const valueLine = line()
            .x(d => xScaler(d.time))
            .y(d => yScaler(d.value))


        return {
            loading: false,
            valueLine,
            parameters: {
                domainX
            },
            xScaler,
            dataPoints: props.dataPoints
        }
    }

    setCanvasRef(ref) {
        this._canvasRef = ref
        if (ref == null) {
            console.log("Nullen")
            return
        }
        this.canvasRender()
    }

    canvasRender() {
        const xScaler = scaleLinear()
            .range([0, this.props.innerWidth])
            .domain(this.props.domainX)


        const translateX = xScaler(this.state.xScaler.invert(0))
        const scaleX = xScaler(this.state.xScaler.invert(1)) - translateX
        console.log(translateX, scaleX)

        console.log("Rendern")

        const context = this._canvasRef.getContext('2d')

        const valueLine = this.state.valueLine
            .context(context)

        context.resetTransform()
        context.translate(translateX, 0)
        context.scale(scaleX, 1)

        context.clearRect(0, 0, this._canvasRef.width, this._canvasRef.height)

        context.beginPath()
        valueLine(this.state.dataPoints)
        context.lineWidth = 1.5
        context.strokeStyle = this.props.color
        context.stroke()
    }

    render() {
        // Todo Hooks?
        if (this.state.loading) {
            return <text>Keine Daten</text>
        }

        if (this._canvasRef)
            this.canvasRender()

        return (
            <canvas width={this.props.innerWidth} height={this.props.innerHeight} ref={this.setCanvasRef} />
        )
    }
}

export default Line
