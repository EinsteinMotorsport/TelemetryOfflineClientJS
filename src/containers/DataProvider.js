import React, { Component } from 'react'

import dataManager from '../data/dataManager'
import DataContext from '../DataContext'

/**
 * Stellt die Channel Daten inklusive Channel Definitions und Gesamtlänge als React Context bereit
 */
class DataProvider extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this._getData()
        }
        dataManager.onChange(() => this._updateData())
    }

    _getData() {
        return {
            channelDefinitions: dataManager.getChannelDefinitions(),
            channelData: dataManager.getAllData(),
            totalDuration: dataManager.getTotalDuration()
        }
    }

    _updateData() {
        this.setState({
            data: this._getData()
        })
    }

    render() {
        return (
            <DataContext.Provider value={this.state.data}>
                {this.props.children}
            </DataContext.Provider>
        )
    }
}

window.getAllData =  dataManager.getAllData

export default DataProvider
