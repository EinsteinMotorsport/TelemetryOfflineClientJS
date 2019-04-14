import { useEffect, useState, useContext } from 'react'
import DataSupplierContext from '../data/dataSupplierContext'

const useTotalDuration = () => {
    const [result, setResult] = useState(null)

    const dataSupplier = useContext(DataSupplierContext)
    
    useEffect(() => {
        const dataRequest = {
            type: 'totalDuration'
        }
    
        dataSupplier.subscribe(dataRequest, event => {
            setResult(event.totalDuration)
        })
        return () => { // Effect-Cleanup
            dataSupplier.unsubscribe(dataRequest)
        }
    }, [dataSupplier]) // Split in primitive types so it can be identity compared

    return result
}

export default useTotalDuration
