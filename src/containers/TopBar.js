import React from 'react'
import { connect } from 'react-redux'

import { addTile, setCursorX, setDomainX, setTilePositions, setTileSettings } from '../actions'

const TopBar = ({
    addTile,
    setCursorX,
    className,
    setDomainX,
    domainX,
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
            <button onClick={() => setDomainX(domainX[1] > 50 ? [10, 20] : [10, domainX[1] + 10])}>Set Range</button>
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
                        channels: [3, 118, 120, 24]
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
                        channel: 3,
                        color: '#20ff05',
                        domainY: [-5e6, 5e6]
                    }
                })

            }}>Demo</button>
        </div>
    )

const mapStateToProps = state => {
    return {
        domainX: state.selection.domainX
    }
}

const mapDispatchToProps = { addTile, setCursorX, setDomainX, setTilePositions, setTileSettings }

/**
 * Leiste am oberen Rand
 */
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TopBar)
