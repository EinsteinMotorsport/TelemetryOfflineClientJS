import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
    overflow: auto;
    height: 100%;
`

export default (props) => {
    const struct = {
        id: null,
        width: null,
        height: null,
        settings: null,
        setSettings: null,
        selection: {
            range: null,
            setRange: null,
            cursorX: null,
            setCursorX: null
        },
        data: {
            channelDefinitions: null,
            totalDuration: null,
            //channelData: null
        }
    }

    const serialize = (obj, props) => (
        <ul>
            {Object.keys(obj).map(key => {
                if (obj[key] === null) {
                    let stringified
                    if (typeof props[key] === 'function') {
                        stringified = props[key].toString()
                    } else {
                        stringified = JSON.stringify(props[key])
                        if (stringified === undefined)
                            stringified = 'undefined'
                        if (stringified.length > 500)
                            stringified = stringified.slice(0, 500) + '…'
                    }
                    return <li key={key}>{key}: {stringified}</li>
                } else if (props[key] === undefined) 
                    return <li key={key}>{key}: undefined</li>
                else
                    return (
                        <li key={key}>{key}:{serialize(obj[key], props[key])}</li>
                    )
            })}
        </ul>
    )



    return (
        <Container>
            {serialize(struct, props)}
        </Container>
    )
}
