import React from 'react'
import styled from 'styled-components'

import Workspace from '../containers/Workspace'

const App = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-flow: column;
`

const TopBar = styled.div`
  height: 50px;
  background-color: orange;
`

const StyledWorkspace = styled(Workspace)`
  flex-grow: 1; /* Fülle restlichen verfügbaren Platz */
`

export default () => (
  <App>
    <TopBar></TopBar>
    <StyledWorkspace></StyledWorkspace>
  </App>
)
