import React from 'react'
import { MosaicWindow } from 'react-mosaic-component'
import { connect } from 'react-redux'
import styled from 'styled-components'

import OverviewGraph from '../components/OverviewGraph'
import LineGraph from '../components/LineGraph'
import DataContext from '../DataContext'

const StyledBody = styled.div`
    background-image: linear-gradient(#333333, #222222);
`

const tileTypes = {
    LineGraph,
    OverviewGraph
}

const Tile = ({ tileId, path, size, tileSettings }) => {
    const TileType = tileTypes[tileSettings.type] || (() => <div>Error</div>)
    return (
        <MosaicWindow path={path} title={`Tile ${tileId}: ${size.width}x${size.height}; Channel: ${tileSettings.channel}`} >
            {/* TODO Subtraktion von Höhe und Breite an Style koppelbar? */}
            <StyledBody>
                <DataContext.Consumer>
                    {value =>
                        <TileType channel={tileSettings.channel} width={size.width - 6} height={size.height - 6 - 30} range={[0, 40]} setRange={() => { }} value={value} />
                    }
                </DataContext.Consumer>
            </StyledBody>
        </MosaicWindow>
    )
}

const mapStateToProps = (state, componentProps) => ({
    tileSettings: state.workspace.tileSettings[componentProps.tileId]
})

const mapDispatchToProps = {}

/**
 * Auf dem Workspace verschiebare Kachel
 * Enthält Graphen, Tabellen etc.
 */
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Tile)
