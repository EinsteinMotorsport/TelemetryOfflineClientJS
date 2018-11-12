import React, { Component } from 'react';
import {
  Mosaic,
  MosaicWindow,
  MosaicZeroState
} from 'react-mosaic-component';
import '@blueprintjs/core/lib/css/blueprint.css';
import 'react-mosaic-component/react-mosaic-component.css';
import styled from 'styled-components';
import { connect } from "react-redux";

import { setMosaic } from '../actions';
import Test from '../components/Test';

const StyledWorkspace = styled.div`
  background-color: grey;
  display: flex;
`;

const StyledMosaic = styled(Mosaic)`
  height: initial;
`;

class Workspace extends Component {

  constructor(props) {
    super(props);

    this.createNode = this.createNode.bind(this);
  }

  render() {
    return (
      <StyledWorkspace className={this.props.className}>
        <StyledMosaic
          renderTile={(id, path) => (
            <MosaicWindow path={path} createNode={this.createNode} title={id}>
              <Test {...this.props.tiles[id].props}></Test>
              <p>{id}</p>
              <h1>Was geht ab?</h1>
            </MosaicWindow>
          )}
          zeroStateView={<MosaicZeroState createNode={this.createNode} />}
          value={this.props.currentNode}
          onChange={this.props.setMosaic}
          className={"mosaic-blueprint-theme"}
          resize={{
            onRelease: (...dings) => console.log(dings),
            wasgeht: "hallo"
          }}
        />
      </StyledWorkspace>
    );
  }

  createNode() {
    let i = 0;
    while (this.props.tiles[i])
      i++;
      this.props.tiles[i] = {
        title: "hallo",
        props: {
          test: "leeel"
        }
      }
    return i;
  }
}

const mapStateToProps = (state /*, ownProps*/) => {
  return {
    currentNode: state.workspace.currentNode,
    tiles: state.workspace.tiles,
    tomate: 12345
  };
};

const mapDispatchToProps = { setMosaic };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Workspace);

// TODO Proptypes
// TODO Redux State nur bei fertigem Resize und fertigem Draggen verändern und nicht ständig
