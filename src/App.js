import React, { Component } from 'react';
import './App.css';
import styled from 'styled-components';
import Workspace from './containers/Workspace';

const App = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-flow: column;
`;

const TopBar = styled.div`
  height: 50px;
  background-color: orange;
`;

const StyledWorkspace = styled(Workspace)`
  flex-grow: 1;
`;

export default () => (
  <App>
    <TopBar></TopBar>
    <StyledWorkspace></StyledWorkspace>
  </App>
)
