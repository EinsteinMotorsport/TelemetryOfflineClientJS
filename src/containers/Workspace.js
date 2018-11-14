import React from 'react'
import {
    Mosaic,
    MosaicZeroState
} from 'react-mosaic-component'
import styled from 'styled-components'
import { connect } from 'react-redux'

import 'react-mosaic-component/react-mosaic-component.css'
import '@blueprintjs/core/lib/css/blueprint.css'

import { setMosaic } from '../actions'
import Tile from './Tile'

const StyledWorkspace = styled.div`
  background-color: grey;
  display: flex;
`

const StyledMosaic = styled(Mosaic)`
  height: initial;
`

const Workspace = (props) => (
    <StyledWorkspace className={props.className}>
        <StyledMosaic
            renderTile={(id, path) => <Tile tileId={id} path={path} />}
            zeroStateView={<MosaicZeroState />}
            value={props.currentNode}
            onChange={props.setMosaic}
            className={"mosaic-blueprint-theme"}
            resize={{
                onRelease: (...dings) => console.log(dings),
            }}
        />
    </StyledWorkspace>
)

const mapStateToProps = state => {
    return {
        currentNode: state.workspace.currentNode,
        tiles: state.workspace.tiles
    }
}

const mapDispatchToProps = { setMosaic }

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Workspace)

// TODO Redux State nur bei fertigem Resize und fertigem Draggen verändern und nicht ständig
