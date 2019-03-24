import { useEffect, useState, useContext } from 'react'
import DataSupplierContext from '../data/dataSupplierContext'

const useChannelData = ({
    channel,
    domainX: [domainXFrom, domainXTo],
    resolution
}) => {
    const [dataPoints, setDataPoints] = useState({
        fullyLoaded: false,
        channelData: []
    })

    const dataSupplier = useContext(DataSupplierContext)
    
    useEffect(() => {
        const dataRequest = {
            channel,
            domainX: [domainXFrom, domainXTo],
            resolution
        }
        dataSupplier.subscribe(dataRequest, event => {
            //console.log(event)
            setDataPoints(event)
        })
        return () => { // Effect-Cleanup
            dataSupplier.unsubscribe(dataRequest)
        }
    }, [channel, domainXFrom, domainXTo, resolution]) // Split in primitive types so it can be identity compared

    return dataPoints
}

export default useChannelData
