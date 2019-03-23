import React from 'react'
import styled from 'styled-components'

import dataManager from '../data/dataManager'
import { zoom as d3Zoom, zoomIdentity as d3ZoomIdentity } from 'd3'
import { select, event } from 'd3-selection'
import { axisBottom, axisLeft, } from 'd3-axis'
import { scaleLinear } from 'd3-scale'
import { line, curveMonotoneX } from 'd3-shape'
import { max, extent } from 'd3-array'
import { brushX } from 'd3-brush'

const StyledPath = styled.path`
    stroke: ${props => props.color};
    fill: none;
    stroke-width: 2px;
`

export default ({
    channel,
    width,
    height,
    range,
    setRange,
    value
}) => {
    //const entries = dataManager.getData(channel)
    const entries = value.channelData[channel]
    if (!entries)
        return null

    if (!range)
        return null


    // set the dimensions and margins of the graph
    const margin = { top: 20, right: 20, bottom: 20, left: 40 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    //console.log(range)

    // set the ranges
    const x = scaleLinear()
        .range([0, innerWidth])
        .domain(range)

    const y = scaleLinear()
        .range([innerHeight, 0])
        .domain(extent(entries, d => d.value))

    const xAxis = axisBottom(x)

    const yAxis = axisLeft(y)

    // define the line
    const valueLine = line()
        .curve(curveMonotoneX)
        .x(d => x(d.time))
        .y(d => y(d.value))


    const linePath = valueLine(entries)

    const zoom = d3Zoom()
        .scaleExtent([1, Infinity])
        .translateExtent([[0, 0], [innerWidth, innerHeight]])
        .extent([[0, 0], [innerWidth, innerHeight]])
        .on("zoom", zoomed)

    function zoomed() {
        if (event.sourceEvent && event.sourceEvent.type === "brush") return // ignore zoom-by-brush
        var t = event.transform
        //console.log(t)
        const newRange = [...range]
        newRange[0] = t.applyX(range[0])
        newRange[1] = t.applyX(range[1])
        //console.log(range);
        //console.log(newRange)
        setRange(t.rescaleX(x).domain())
        //console.log(t.rescaleX(x).domain())
        //setRange(t.rescalex(domain());
        //xFocus.domain(t.rescaleX(x).domain());
        //focus.select(".area").attr("d", area);
        //focus.select(".axis--x").call(xAxis);
        //select(".brush").call(brush.move, xFocus.range().map(t.invertX, t));
    }


    //console.log(entries)

    const id = 'clipid' + Math.floor(Math.random() * 1e9) // TODO stable id

    return (
        <svg
            className="container"
            height={height}
            width={width}
        >

            <g transform={"translate(" + margin.left + "," + margin.top + ")"}>

                {/* ADD: our two axes' groups, and when their DOM nodes mount, select them, and "call" (render into them) the x and y axes respectively. */}
                <StyledPath d={linePath} style={{ clipPath: "url(" + id + ")" }} color={['green', 'blue', 'orange', 'yellow', 'lime'][channel % 5]} />
                <g className="xAxis" transform={"translate(0," + innerHeight + ")"} ref={node => select(node).call(xAxis)} />
                <g className="yAxis" ref={node => select(node).call(yAxis)} />
            </g>
            <rect className={"zoom"} width={innerWidth} height={innerHeight} transform={"translate(" + margin.left + "," + margin.top + ")"} ref={node => select(node).call(zoom)}></rect>

            <defs>
                <clipPath id={id}>
                    <rect width={innerWidth} height={innerHeight} />
                </clipPath>
            </defs>
        </svg>
    )
}
