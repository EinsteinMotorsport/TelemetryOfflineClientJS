import React, { Component } from 'react'
import {
  Mosaic,
  MosaicWindow,
  MosaicZeroState
} from 'react-mosaic-component'
import '@blueprintjs/core/lib/css/blueprint.css'
import 'react-mosaic-component/react-mosaic-component.css'
import styled from 'styled-components'
import { connect } from "react-redux"

import { setMosaic, setTile } from '../actions'
import Test from '../components/Test'

const StyledWorkspace = styled.div`
  background-color: grey;
  display: flex;
`

const StyledMosaic = styled(Mosaic)`
  height: initial;
`

class Workspace extends Component {

  constructor(props) {
    super(props)

    this.createNode = this.createNode.bind(this)
  }

  render() {
    return (
      <StyledWorkspace className={this.props.className}>
        <StyledMosaic
          renderTile={(id, path) => {
            const tile = this.props.tiles[id]
            return (
              <MosaicWindow path={path} createNode={this.createNode} title={tile.title} >
                <Test {...tile.props}></Test>
                <p>{id}</p>
                <h1>Was geht ab?</h1>
              </MosaicWindow>
            )
          }}
          zeroStateView={<MosaicZeroState createNode={this.createNode} />}
          value={this.props.currentNode}
          onChange={this.props.setMosaic}
          className={"mosaic-blueprint-theme"}
          resize={{
            onRelease: (...dings) => console.log(dings),
          }}
        />
      </StyledWorkspace>
    )
  }

  createNode() {
    let i = 0
    while (this.props.tiles[i])
      i++
    this.props.setTile(i, {
      title: "hallo " + Math.random(),
      props: {
        test: "leeel"
      }
    })
    console.log(i)
    return i
  }
}

const mapStateToProps = state => {
  return {
    currentNode: state.workspace.currentNode,
    tiles: state.workspace.tiles,
    tomate: 12345
  }
}

const mapDispatchToProps = { setMosaic, setTile }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Workspace)

// TODO Proptypes
// TODO Redux State nur bei fertigem Resize und fertigem Draggen verändern und nicht ständig
