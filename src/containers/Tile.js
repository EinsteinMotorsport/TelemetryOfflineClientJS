import React from 'react'
import { MosaicWindow } from 'react-mosaic-component'
import { connect } from 'react-redux'

import Test from '../components/Test'

const Tile = ({ tileId, path, tileSettings }) => {
    const tile = tileSettings[tileId]
    return (
        <MosaicWindow path={path} /*createNode={createNode}*/ title={tile.title}>
            <Test {...tile.props}></Test>
            <p>{tileId}</p>
            <h1>Was geht ab?</h1>
        </MosaicWindow>
    )
}

const mapStateToProps = state => ({
    tileSettings: state.workspace.tileSettings
})

const mapDispatchToProps = {}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Tile)
