import React from 'react'
import styled from 'styled-components'

import dataManager from '../managers/dataManager'
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

    if (!range) {
        setRange(extent(entries, d => d.time))
        console.log("set range")
        return null
    }

    // set the dimensions and margins of the graph
    const margin = { top: 20, right: 20, bottom: 20, left: 40 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // set the rangess
    const x = scaleLinear()
        .range([0, innerWidth])
        .domain([0, value.totalDuration])

    const y = scaleLinear()
        .range([innerHeight, 0])
        .domain(extent(entries, d => d.value))

    const xAxis = axisBottom(x)

    const xFocus = scaleLinear()
        .range([0, innerWidth])
        .domain(extent(entries, d => d.time))

    // define the line
    const valueLine = line()
        .curve(curveMonotoneX)
        .x(d => x(d.time))
        .y(d => y(d.value))


    const linePath = valueLine(entries)

    const brush = brushX()
        .extent([[0, 0], [innerWidth, innerHeight]])
        .on("brush end", brushed)

    /*const zoom = d3Zoom()
        .scaleExtent([1, Infinity])
        .translateExtent([[0, 0], [innerWidth, innerHeight]])
        .extent([[0, 0], [innerWidth, innerHeight]])
        .on("zoom", zoomed);*/

    function brushed() {
        if (event.sourceEvent && event.sourceEvent.type === "zoom") return // ignore brush-by-zoom
        var s = event.selection || x.range()
        setRange(s.map(x.invert, x))
        //xFocus.domain(s.map(x.invert, x));
        //focus.select(".area").attr("d", area);
        //focus.select(".axis--x").call(xAxis);
        /*select(".zoom").call(zoom.transform, d3ZoomIdentity
            .scale(innerWidth / (s[1] - s[0]))
            .translate(-s[0], 0));*/
    }

    /*function zoomed() {
        if (event.sourceEvent && event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
        var t = event.transform;
        xFocus.domain(t.rescaleX(x).domain());
        //focus.select(".area").attr("d", area);
        //focus.select(".axis--x").call(xAxis);
        select(".brush").call(brush.move, xFocus.range().map(t.invertX, t));
    }*/


    //console.log(entries)

    return (
        <svg
            className="container"
            height={height}
            width={width}
        >

            <g transform={"translate(" + margin.left + "," + margin.top + ")"}>

                {/* ADD: our two axes' groups, and when their DOM nodes mount, select them, and "call" (render into them) the x and y axes respectively. */}
                <StyledPath d={linePath} className="line" color={['green', 'blue', 'orange', 'yellow', 'lime'][channel % 5]}/>
                <g className="xAxis" transform={"translate(0," + innerHeight + ")"} ref={node => select(node).call(xAxis)} />
                <g className={"brush"} ref={node => select(node).call(brush).call(brush.move, range.map(x))}></g>
            </g>
            {//<rect className={"zoom"} width={innerWidth} height={innerHeight} transform={"translate(" + margin.left + "," + margin.top + ")"} ref={node => select(node).call(zoom)}></rect>
            }
        </svg>
    )
}
