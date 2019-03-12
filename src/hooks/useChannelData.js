import { useEffect, useState } from 'react'

import dataManager from '../managers/dataManager'

const useChannelData = ({
    channel,
    domainX: [domainXFrom, domainXTo],
    resolution
}) => {
    const [dataPoints, setDataPoints] = useState(null)
    
    useEffect(() => {
        const dataRequest = {
            channel,
            domainX: [domainXFrom, domainXTo],
            resolution
        }
        setDataPoints(dataManager.registerDataSupplier(dataRequest, setDataPoints))
        return () => {
            dataManager.unregisterDataSupplier(dataRequest)
        }
    }, [channel, domainXFrom, domainXTo, resolution]) // Split in primitive types so it can be identity compared

    return dataPoints
}

export default useChannelData
