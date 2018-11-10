import React, { Component } from 'react';
import {
  Mosaic,
  MosaicWindow,
  MosaicZeroState
} from 'react-mosaic-component';
import '@blueprintjs/core/lib/css/blueprint.css';
import 'react-mosaic-component/react-mosaic-component.css';
import styled from 'styled-components';
import Test from '../components/Test';

const StyledWorkspace = styled.div`
  background-color: grey;
  display: flex;
`;

const StyledMosaic = styled(Mosaic)`
  height: initial;
`;

export default class Workspace extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentNode: null,
      tiles: []
    };

    this.createNode = this.createNode.bind(this);
  }

  render() {
    return (
      <StyledWorkspace className={this.props.className}>
        <StyledMosaic
          renderTile={(id, path) => (
            <MosaicWindow path={path} createNode={this.createNode} title={id}>
              <Test {...this.state.tiles[id].props}></Test>
              <p>{id}</p>
            </MosaicWindow>
          )}
          zeroStateView={<MosaicZeroState createNode={this.createNode} />}
          value={this.state.currentNode}
          onChange={(currentNode) => this.setState({ currentNode })}
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
    while (this.state.tiles[i])
      i++;
      this.state.tiles[i] = {
        title: "hallo",
        props: {
          test: "leeel"
        }
      }
    return i;
  }
}
