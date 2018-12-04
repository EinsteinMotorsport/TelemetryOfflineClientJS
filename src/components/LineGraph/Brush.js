import React from 'react'
import styled from 'styled-components'
import { select, event } from 'd3-selection'
import { brushX } from 'd3-brush'

const StyledLine = styled.line`
    stroke-width: 1;
    stroke: #ffffff;
`

export default (props) => {
    let {
        range,
        setRange,
        innerHeight,
        innerWidth,
        xScaler
    } = props

    console.log(props)

    console.log("Range: ", range)

    function brushed() {
        if (event.sourceEvent && event.sourceEvent.type === "zoom") return // ignore brush-by-zoom
        var s = event.selection || xScaler.range()
        //setRange(s.map(xScaler.invert, xScaler))
        const newRange = s.map(xScaler.invert, xScaler)
        console.log(newRange, range)
        if (newRange[0] === range[0] && newRange[1] === range[1])
            return
        console.log("Setze Range")
        range = newRange
        setRange([newRange[0], newRange[1]])
        //xFocus.domain(s.map(x.invert, x));
        //focus.select(".area").attr("d", area);
        //focus.select(".axis--x").call(xAxis);
        /*select(".zoom").call(zoom.transform, d3ZoomIdentity
            .scale(innerWidth / (s[1] - s[0]))
            .translate(-s[0], 0));*/
    }

    const brush = brushX()
        .extent([[0, 0], [innerWidth, innerHeight]])
        .on("brush end", brushed)

    return (
        <g className={"brush"} ref={node => {
            const d3Node = select(node)
            brush(d3Node)
            brush.move(d3Node, range.map(xScaler))
        }}></g>
    )
}
