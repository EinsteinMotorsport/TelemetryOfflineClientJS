import simplify from '../util/simplify'
import { registerWorker } from '../util/workerAsync'
import { getIndexAfterXTyped } from '../util'
import { simplifytest } from '../util/simplifytest'
import { ChannelData } from '../data/typeDefs'
import { Float64Float64ChannelData } from '../data/ChannelData'

registerWorker(self, async request => {
    const response = await fetch(`channelData/${request.channel}.offlinechannel`)
    let buffer
    if (response.status !== 200)
        return 'notFound'
    try {
        buffer = await response.arrayBuffer()
    } catch (e) {
        console.error('Error loading channeldata', e)
        return 'error'
    }

    
    const array = new Float64Array(buffer)
    const raw = {
        type: 'FLOAT64_FLOAT64',
        data: array
    }
    let data = new Float64Float64ChannelData(raw)

    data = data.subdataByTime(request.domainX[0], request.domainX[1])

    /* TODO if (request.resolution !== 0) { // resolution 0 means original data => no simplification
        data = simplifytest(data, request.resolution, true)
    }*/


    convertToSharedArrayBuffer(data)

    return data.asRaw()
})

function convertToSharedArrayBuffer(channelData) {
    const raw = channelData.asRaw()
    const oldData = raw.data
    const shared = new SharedArrayBuffer(oldData.byteLength)
    const newTyped = new Float64Array(shared)
    for (let i = 0; i < oldData.length; i++) {
        newTyped[i] = oldData[i]
    }
    raw.data = newTyped
}

export default null
