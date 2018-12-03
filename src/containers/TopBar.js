import React from 'react'
import { connect } from 'react-redux'

import { addTile, setCursorX, setRange, setTilePositions, setTileSettings } from '../actions'

const TopBar = ({
    addTile,
    setCursorX,
    className,
    setRange,
    range,
    setTilePositions,
    setTileSettings
}) => (
        <div className={className}>
            <button onClick={() => {
                const channel = Math.floor(Math.random() * 128) + 2
                addTile({
                    type: Math.random() < 0.5 ? 'LineGraph' : 'OverviewGraph',
                    settings: {
                        channel
                    }
                })
            }}>Neu</button>
            <button onClick={() => setCursorX(Math.floor(Math.random() * 100))}>Set Cursor</button>
            <button onClick={() => setRange(range[1] > 50 ? [10, 20] : [10, range[1] + 10])}>Set Range</button>
            <button onClick={() => {
                setTilePositions({
                    direction: 'row',
                    first: 0,
                    second: {
                        direction: 'column',
                        first: {
                            first: 2,
                            second: {
                                first: 3,
                                second: 4,
                                direction: 'row',
                                splitPercentage: 50
                            },
                            direction: 'column',
                            splitPercentage: 50
                        },
                        second: 1,
                        splitPercentage: 54.99207606973059
                    },
                    splitPercentage: 20
                })
                setTileSettings(0, {
                    type: 'ValueTable',
                    settings: {
                        channel: 118
                    }
                })
                setTileSettings(1, {
                    type: 'LineGraph',
                    settings: {
                        channel: 3,
                        color: 'orange'
                    }
                })
                setTileSettings(2, {
                    type: 'LineGraph',
                    settings: {
                        channel: 107,
                        overview: true
                    }
                })
                setTileSettings(3, {
                    type: 'LineGraph',
                    settings: {
                        channel: 3,
                        color: '#0077ff'
                    }
                })
                setTileSettings(4, {
                    type: 'LineGraph',
                    settings: {
                        channel: 29,
                        color: '#20ff05'
                    }
                })

            }}>Demo</button>
        </div>
    )

const mapStateToProps = state => {
    return {
        range: state.selection.range
    }
}

const mapDispatchToProps = { addTile, setCursorX, setRange, setTilePositions, setTileSettings }

/**
 * Leiste am oberen Rand
 */
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TopBar)
