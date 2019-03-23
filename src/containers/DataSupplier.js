import React, { Component } from 'react'
import dataManager from '../data/dataManager'

class DataSupplier extends Component {
    constructor(props) {
        super(props)
        this.state = {
            _onChange: this._onChange.bind(this)
        }
    }

    componentWillUnmount() {
        console.log("Ende von dem COmponent")
        dataManager.unregisterDataSupplier(this.state.dataRequest)
    }

    _onChange(dataPoints) {
        this.setState({
            dataPoints
        })
    }

    static getDerivedStateFromProps(props, state) {
        // Prüfung auf Änderung
        if (state.dataRequest) {
            const dataRequest = state.dataRequest
            if (dataRequest.channel === props.channel
                && dataRequest.domainX[0] === props.domainX[0]
                && dataRequest.domainX[1] === props.domainX[1]
                && dataRequest.resolution === props.resolution
            ) {
                    return null
            }
        }

        const dataRequest = {
            channel: props.channel,
            domainX: props.domainX,
            resolution: props.resolution
        }
        const dataPoints = dataManager.registerDataSupplier(dataRequest, state._onChange)

        if (state.dataRequest) {
            dataManager.unregisterDataSupplier(state.dataRequest)
        }

        return {
            dataRequest,
            dataPoints
        }
    }

    render() {
        return this.props.children(this.state.dataPoints)
    }
}

export default DataSupplier
