import React from 'react'
import { connect } from 'react-redux'

import { addTile } from '../actions'

const TopBar = ({
    addTile,
    className
}) => (
        <div className={className}>
            <button onClick={() => addTile()}>Neu</button>
        </div>
    )

const mapStateToProps = state => {
    return {}
}

const mapDispatchToProps = { addTile }

/**
 * Leiste am oberen Rand
 */
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TopBar)
