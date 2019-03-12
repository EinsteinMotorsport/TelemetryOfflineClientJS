import React, { Component } from 'react'
import styled from 'styled-components'
import { line } from 'd3-shape'
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

        const linePath = valueLine(props.dataPoints)

        return {
            loading: false,
            linePath,
            parameters: {
                domainX
            },
            xScaler,
            dataPoints: props.dataPoints
        }
    }

    render() {
        if (this.state.loading) {
            return <text>Keine Daten</text>
        }

        const xScaler = scaleLinear()
            .range([0, this.props.innerWidth])
            .domain(this.props.domainX)


        const translateX = xScaler(this.state.xScaler.invert(0))
        const scaleX = xScaler(this.state.xScaler.invert(1)) - translateX
        //console.log(translateX, scaleX)

        return (
            <StyledPath d={this.state.linePath} color={this.props.color} clipId={this.props.clipId} 
            transform={`translate(${translateX} ,0) scale(${scaleX}, 1)`}/>
        )
    }
}

export default Line
