import React from 'react'
import { select, event } from 'd3-selection'
import { brushX } from 'd3-brush'

/**
 * Domain-Selektor: Markiert Bereich in Overview LineGraph
 */
const Brush = ({
    domainX,
    setDomainX,
    innerHeight,
    innerWidth,
    xScaler
}) => {

    function brushed() {
        if (event.sourceEvent && event.sourceEvent.type === 'zoom') return // ignore brush-by-zoom
        var s = event.selection || xScaler.range()
        //setRange(s.map(xScaler.invert, xScaler))
        const newRange = s.map(xScaler.invert, xScaler)
        //console.log(newRange, range)
        if (newRange[0] === domainX[0] && newRange[1] === domainX[1])
            return
        //console.log("Setze Range")
        domainX = newRange // TODO Bad practice
        setDomainX([newRange[0], newRange[1]])
        //xFocus.domain(s.map(x.invert, x));
        //focus.select(".area").attr("d", area);
        //focus.select(".axis--x").call(xAxis);
        /*select(".zoom").call(zoom.transform, d3ZoomIdentity
            .scale(innerWidth / (s[1] - s[0]))
            .translate(-s[0], 0));*/
    }

    const brush = brushX()
        .extent([[0, 0], [innerWidth, innerHeight]])
        .on('brush end', brushed)

    return (
        <g ref={node => {
            const d3Node = select(node)
            brush(d3Node)
            brush.move(d3Node, domainX.map(xScaler))
        }}></g>
    )
}

export default Brush
