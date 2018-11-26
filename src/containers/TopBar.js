import React from 'react'
import { connect } from 'react-redux'

import { addTile, setCursorX, setRange } from '../actions'

const TopBar = ({
    addTile,
    setCursorX,
    className,
    setRange,
    range
}) => (
        <div className={className}>
            <button onClick={() => addTile()}>Neu</button>
            <button onClick={() => setCursorX(Math.floor(Math.random() * 100))}>Set Cursor</button>
            <button onClick={() => setRange(range[1] > 50 ? [10, 20] : [10, range[1] + 10])}>Set Range</button>
        </div>
    )

const mapStateToProps = state => {
    return {
        range: state.selection.range
    }
}

const mapDispatchToProps = { addTile, setCursorX, setRange }

/**
 * Leiste am oberen Rand
 */
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TopBar)
