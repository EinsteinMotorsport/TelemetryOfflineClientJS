import React, { Component } from 'react'
import { Mosaic } from 'react-mosaic-component'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { isParent } from 'react-mosaic-component'

import 'react-mosaic-component/react-mosaic-component.css'

import { setTilePositions } from '../actions'
import Tile from './Tile'

const StyledWorkspace = styled.div`
  background-color: grey;
  display: flex;
`

const StyledMosaic = styled(Mosaic)`
  height: initial;
`

/**
 * Berechnet die Größe aller Tiles
 * @param {*} tilePositions 
 * @param {*} width Containergröße
 * @param {*} height Containergröße
 * @param {*} sizes optional
 */
const calcTileSizes = (tilePositions, width, height, sizes = []) => {
    if (tilePositions == null)
        return sizes

    if (!isParent(tilePositions)) { // Tile hat keine Kinder-Tiles
        sizes[tilePositions] = {
            width: Math.round(width),
            height: Math.round(height)
        }
        return sizes
    }

    if (tilePositions.splitPercentage == null)
        tilePositions.splitPercentage = 50

    // Größen für die beiden Kinder-Tiles rekursiv berechnen
    if (tilePositions.direction === 'row') {
        calcTileSizes(tilePositions.first, width * tilePositions.splitPercentage / 100, height, sizes)
        calcTileSizes(tilePositions.second, width * (1 - tilePositions.splitPercentage / 100), height, sizes)
    } else {
        calcTileSizes(tilePositions.first, width, height * tilePositions.splitPercentage / 100, sizes)
        calcTileSizes(tilePositions.second, width, height * (1 - tilePositions.splitPercentage / 100), sizes)
    }
    return sizes
}

class Workspace extends Component {
    constructor(props) {
        super(props)
        this.state = {
            width: 0,
            height: 0
        }
        this._handleWindowResize = this._handleWindowResize.bind(this)
    }

    componentDidMount() {
        window.addEventListener('resize', this._handleWindowResize)
        this._handleWindowResize()
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._handleWindowResize)
    }

    _handleWindowResize() {
        this.setState({
            width: this._containerTarget.offsetWidth - 6, // TODO an Style koppelbar?
            height: this._containerTarget.offsetHeight - 6
        })
    }

    render() {
        const tileSizes = calcTileSizes(this.props.tilePositions, this.state.width, this.state.height)
        return (
            <StyledWorkspace className={this.props.className} ref={node => this._containerTarget = node}> {/* Referenz zum Container ablegen für _handleWindowResize() */}
                <StyledMosaic
                    renderTile={(id, path) => <Tile tileId={id} path={path} size={tileSizes[id]} />} // renderTile wird für jedes Tile auferufen, das gerendert werden soll
                    zeroStateView={<div>Leer</div>} // Ansicht falls kein Tile angezeigt wird
                    value={this.props.tilePositions}
                    onChange={this.props.setTilePositions}
                    resize={{
                        onRelease: (...dings) => console.log(dings)
                    }}
                />
            </StyledWorkspace>)
    }
}

const mapStateToProps = state => ({
    tilePositions: state.workspace.tilePositions
})

const mapDispatchToProps = { setTilePositions }

/**
 * Workspace. Hauptbestandteil der App, der eigentliche Arbeitsbereich
 * Enthält Tiles, die dann wiederum Graphen, Tabellen etc. enthalten
 */
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Workspace)

// TODO Redux State nur bei fertigem Resize und fertigem Draggen verändern und nicht ständig
