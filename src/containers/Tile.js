import React from 'react'
import { MosaicWindow } from 'react-mosaic-component'
import { connect } from 'react-redux'
import styled from 'styled-components'

import OverviewGraph from '../components/OverviewGraph'
import LineGraph from '../components/LineGraphOld'
import DataContext from '../DataContext'
import TestGraph from '../components/TestGraph'
import Table from '../components/Table'
import { setCursorX } from '../actions/index'

const StyledBody = styled.div`
    background-image: linear-gradient(#333333, #222222);
`

const tileTypes = {
    LineGraph: TestGraph,
    OverviewGraph: Table
}

const Tile = ({ tileId, path, size, tileSettings, cursorX, setCursorX, range }) => {
    const TileType = tileTypes[tileSettings.type] || (() => <div>Error</div>)
    return (
        <DataContext.Consumer>
            {data => (
                // Da MosaicWindow shouldComponentUpdate() implementiert und nur neu rendert, wenn sich die props geändert haben, 
                // müssen wir hier als Workaround alle relevanten Props auch noch dem MosaicWindow übergeben. So ein Scheiß. 
                // Siehe https://github.com/palantir/react-mosaic/issues/65
                <MosaicWindow path={path} title={`Tile ${tileId}: ${size.width}x${size.height}; Channel: ${tileSettings.channel}`} workaround={{
                    tileId,
                    size,
                    tileSettings,
                    cursorX,
                    setCursorX,
                    data,
                    range
                }} >
                    {/* TODO Subtraktion von Höhe und Breite an Style koppelbar? */}
                    <StyledBody>
                        <TileType channel={tileSettings.channel} width={size.width - 6} height={size.height - 6 - 30} setRange={() => { }} value={data} id={'tile' + tileId} cursorX={cursorX} setCursorX={setCursorX} range={range} />
                    </StyledBody>
                </MosaicWindow>

            )}
        </DataContext.Consumer>
    )
}

const mapStateToProps = (state, componentProps) => ({
    tileSettings: state.workspace.tileSettings[componentProps.tileId],
    cursorX: state.selection.cursorX,
    range: state.selection.range
})

const mapDispatchToProps = {
    setCursorX
}

/**
 * Auf dem Workspace verschiebbare Kachel
 * Enthält Graphen, Tabellen etc.
 */
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Tile)
