import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { setTileSettings } from '../actions'

const PopUp = styled.div`
    display: flex;
    flex-flow: column;
    position: absolute;
    background-color: grey;
    height: 200px;
    width: 200px;
    z-index: 100;
    left: 100px;
    top: 100px;
`

const StyledTextarea = styled.textarea`
    resize: none;
    display: flex;
    flex-grow: 1;
    color: ${props => props.valid ? 'green' : 'red'};
`

class TileSettingsPopUp extends Component {
    constructor(props) {
        super(props)
        console.log("jo was geth")
        this.state = {
            text: JSON.stringify(props.tileSettings[props.tileId], null, 4),
            valid: true
        }
        this._onInput = this._onInput.bind(this)
    }

    _onInput(event) {
        const value = event.target.value
        this.setState({
            text: value
        })

        try {
            const parsed = JSON.parse(value)
            this.props.setTileSettings(this.props.tileId, parsed)
            this.setState({
                valid: true
            })
        } catch(e) {
            this.setState({
                valid: false
            })
        }
    }

    render() {
        return (
            <PopUp>
                <div>Tile {this.props.tileId}</div>
                <StyledTextarea onChange={this._onInput} value={this.state.text} valid={this.state.valid} />
            </PopUp>

        )
    }
}

const mapStateToProps = state => ({
    tileSettings: state.workspace.tileSettings
})

const mapDispatchToProps = { setTileSettings }

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TileSettingsPopUp)
