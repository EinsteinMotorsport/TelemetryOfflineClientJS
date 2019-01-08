import React, { Component } from 'react'

import { throttle } from '../util'

const withReduxAccelerator = (WrappedComponent, acceleratedProps) => (
    class CursorXAccelerator extends Component {
        constructor(props) {
            super(props)
            this.state = {
                accProps: []
            }

            this._accProps = this._flatAcceleratedProps(acceleratedProps)
        }

        _getProp(location, name) {
            let obj = this.props
            location.forEach(key => {
                obj = obj[key]
            })
            return obj[name]
        }

        _setStateAccProps(index, obj) {
            this.setState(prevState => ({
                accProps: [
                    ...prevState.accProps.slice(0, index),
                    obj,
                    ...prevState.accProps.slice(index + 1)
                ]
            }))
        }

        _flatAcceleratedProps(obj, parentLocation = [], arr = []) {
            Object.keys(obj).forEach(key => {
                if (typeof obj[key] === 'object') {
                    const location = [...parentLocation, key]
                    this._flatAcceleratedProps(obj[key], location, arr)
                } else {
                    const setName = 'set' + key.charAt(0).toUpperCase() + key.slice(1)
                    const originalSet = this._getProp(parentLocation, setName)

                    const setRedux = throttle(value => {
                        this._setStateAccProps(index, {
                            useLocal: false
                        })
                        originalSet(value)
                    }, obj[key] || 100)

                    const name = key
                    const index = arr.push({
                        name,
                        setName,
                        location: parentLocation,
                        set: value => {
                            this._setStateAccProps(index, {
                                useLocal: true,
                                value: value
                            })
                            setRedux(value)
                        },
                        get: () => {
                            if (this.state.accProps[index].useLocal)
                                return this.state.accProps[index].value
                            return this._getProp(parentLocation, name)
                        }
                    }) - 1
                    this.state.accProps[index] = {
                        useLocal: false
                    }
                }
            })
            return arr
        }

        render() {
            const props = {...this.props}
            this._accProps.forEach(accProp => {
                let obj = props
                accProp.location.forEach(key => {
                    obj = obj[key]
                })
                obj[accProp.name] = accProp.get()
                obj[accProp.setName] = accProp.set
            })

            return <WrappedComponent {...props} />
        }
    }
)

export default withReduxAccelerator
