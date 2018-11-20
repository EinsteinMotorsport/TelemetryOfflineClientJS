import React from 'react'
import styled from 'styled-components'

import Workspace from '../containers/Workspace'
import TopBar from '../containers/TopBar'

const App = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-flow: column;
`

const StyledTopBar = styled(TopBar)`
  height: 50px;
  background-color: orange;
`

const StyledWorkspace = styled(Workspace)`
  flex-grow: 1; /* Fülle restlichen verfügbaren Platz */
`

export default () => (
    <App>
        <StyledTopBar></StyledTopBar>
        <StyledWorkspace></StyledWorkspace>
    </App>
)
