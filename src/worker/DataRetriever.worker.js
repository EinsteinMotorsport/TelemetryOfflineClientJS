import simplify from '../util/simplify'
import { registerWorker } from '../util/workerAsync'
import { getIndexAfterXTyped } from '../util'
import { simplifytest } from '../util/simplifytest'

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

    const from = Math.max(getIndexAfterXTyped(array, request.domainX[0]) - 1, 0)
    const to = Math.min(getIndexAfterXTyped(array, request.domainX[1]) + 1, array.length / 2)

    let data = array.subarray(from * 2, to * 2)

    if (request.resolution !== 0) { // resolution 0 means original data => no simplification
        data = simplifytest(data, request.resolution, true)
    }


    const result = []
    for (let i = 0; i < data.length / 2; i++) { // todo wrapper für ChannelData als SharedArrayBuffer
        result.push({
            time: data[i * 2],
            value: data[i * 2 + 1]
        })
    }

    return result
})

export default null
