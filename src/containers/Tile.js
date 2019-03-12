import React from 'react'
import { MosaicWindow } from 'react-mosaic-component'
import { connect } from 'react-redux'
import styled from 'styled-components'

import TestTile from '../components/TestTile'
import LineGraph from '../components/LineGraph/'
import ValueTable from '../components/ValueTable'
import DataContext from '../DataContext'
import TileErrorBoundary from './TileErrorBoundary'

import {
    setCursorX,
    toggleSettingsPopUp,
    setTileSettings,
    setDomainX
} from '../actions/index'

const StyledBody = styled.div`
    background-image: linear-gradient(#333333, #222222);
    color: #ffffff;
    height: 100%;
`

const tileTypes = {
    TestTile,
    LineGraph,
    ValueTable
}

const Tile = ({ tileId, path, size, tileSettings, selection, setCursorX, toggleSettingsPopUp, setTileSettings, setDomainX }) => {
    const TileType = tileTypes[tileSettings.type] || (() => <div>Unknown TileType '{tileSettings.type}'</div>)
    let tileProps
    return (
        // Da MosaicWindow shouldComponentUpdate() implementiert und nur neu rendert, wenn sich die props geändert haben, 
        // müssen wir hier als Workaround alle relevanten Props auch noch dem MosaicWindow übergeben. So ein Scheiß. 
        // Siehe https://github.com/palantir/react-mosaic/issues/65
        <MosaicWindow path={path} title={`Tile ${tileId}: ${size.width}x${size.height}`} additionalControls={<button onClick={() => toggleSettingsPopUp(tileId)}>Settings</button>}
            workaround={tileProps = {
                id: 'tile' + tileId,
                width: size.width - 6,
                height: size.height - 6 - 30,
                settings: tileSettings.settings,
                setSettings: (newSettings) => setTileSettings(tileId, {
                    ...tileSettings,
                    settings: newSettings
                }),
                selection: {
                    ...selection,
                    setDomainX,
                    setCursorX
                }
            }} >
            <StyledBody onContextMenu={event => {
                toggleSettingsPopUp(tileId)
                event.preventDefault()
            }}>
                <TileErrorBoundary>
                    {/* TODO Subtraktion von Höhe und Breite an Style koppelbar? */}
                    <TileType {...tileProps} />
                </TileErrorBoundary>
            </StyledBody>
        </MosaicWindow>
    )
}

const mapStateToProps = (state, componentProps) => ({
    tileSettings: state.workspace.tileSettings[componentProps.tileId],
    selection: state.selection
})

const mapDispatchToProps = {
    setCursorX,
    setDomainX,
    toggleSettingsPopUp,
    setTileSettings
}

/**
 * Auf dem Workspace verschiebbare Kachel
 * Enthält Graphen, Tabellen etc.
 */
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Tile)
