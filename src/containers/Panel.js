import React from 'react'
import dataManager from '../managers/dataManager'
import OverviewGraph from '../components/OverviewGraph'
import LineGraph from '../components/LineGraph'

export default class Panel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            range: [0, 0]
        }
    }

    setRange(newRange) {
        this.setState(state => {
            if (state.range[0] !== newRange[0] || state.range[1] !== newRange[1])
                return {
                    range: newRange
                }
        })
    }

    render() {
        const entries = dataManager.getData(2)
        if (!entries)
            return null

        return (
            <div style={{
                border: "1px solid grey"
            }}>
                <OverviewGraph channel={3} width={1000} height={100} range={this.state.range} setRange={this.setRange.bind(this)} />
                {//<LineGraph channel={3} width={1000} height={600} range={this.state.range} setRange={this.setRange.bind(this)} />
                }
            </div>
        )
    }
}
