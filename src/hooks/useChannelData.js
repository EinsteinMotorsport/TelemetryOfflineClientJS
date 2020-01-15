import { useEffect, useState, useContext } from 'react'
import DataSupplierContext from '../data/dataSupplierContext'
import { EmptyChannelData } from '../data/ChannelData';

const useChannelData = ({
    channel,
    domainX: [domainXFrom, domainXTo],
    resolution,
    priority
}) => {
    const [result, setResult] = useState({
        fullyLoaded: false,
        channelData: new EmptyChannelData()
    })

    const dataSupplier = useContext(DataSupplierContext)
    
    useEffect(() => {
        const dataRequest = {
            type: 'channelData',
            channel,
            domainX: [domainXFrom, domainXTo],
            resolution,
            priority
        }
        dataSupplier.subscribe(dataRequest, event => {
            setResult(event)
        })
        return () => { // Effect-Cleanup
            dataSupplier.unsubscribe(dataRequest)
        }
    }, [dataSupplier, channel, domainXFrom, domainXTo, resolution]) // Split in primitive types so it can be identity compared by React

    return result
}

export default useChannelData
