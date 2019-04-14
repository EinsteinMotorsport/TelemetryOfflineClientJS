import { useEffect, useState, useContext } from 'react'
import DataSupplierContext from '../data/dataSupplierContext'

const useChannelData = ({
    channel,
    domainX: [domainXFrom, domainXTo],
    resolution
}) => {
    const [result, setResult] = useState({
        fullyLoaded: false,
        channelData: []
    })

    const dataSupplier = useContext(DataSupplierContext)
    
    useEffect(() => {
        const dataRequest = {
            type: 'channelData',
            channel,
            domainX: [domainXFrom, domainXTo],
            resolution
        }
        dataSupplier.subscribe(dataRequest, event => {
            setResult(event)
        })
        return () => { // Effect-Cleanup
            dataSupplier.unsubscribe(dataRequest)
        }
    }, [dataSupplier, channel, domainXFrom, domainXTo, resolution]) // Split in primitive types so it can be identity compared

    return result
}

export default useChannelData
