import simplify from '../util/simplify'
import { registerWorker } from '../util/workerAsync'
import { getIndexBeforeX, getIndexAfterXTyped } from '../util'
import { simplifytest } from '../util/simplifytest'

registerWorker(self, (sharedBuffer, domainX, resolution) => {
    const sharedArray = new Float64Array(sharedBuffer)

    const from = Math.max(getIndexAfterXTyped(sharedArray, domainX[0]) - 1, 0)
    const to = Math.min(getIndexAfterXTyped(sharedArray, domainX[1]) + 1, sharedArray.length / 2)

    let data = sharedArray.subarray(from * 2, to * 2)

    if (resolution !== 0) { // resolution 0 means original data => no simplification
        data = simplifytest(data, resolution, true)
    }


    const result = []
    for (let i = 0; i < data.length / 2; i++) {
        result.push({
            time: data[i * 2],
            value: data[i * 2 + 1]
        })
    }

    return result
})

export default null
