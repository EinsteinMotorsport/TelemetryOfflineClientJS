import simplify from '../util/simplify'
import { registerWorker } from '../util/workerAsync'
import { getIndexBeforeX, getIndexBeforeXTyped } from '../util'

registerWorker(self, (sharedBuffer, domainX, resolution) => {
    console.time('simplifyInner')
    const sharedArray = new Float64Array(sharedBuffer)
    const from = Math.max(getIndexBeforeXTyped(sharedArray, domainX[0]), 0)
    const to = Math.min(getIndexBeforeXTyped(sharedArray, domainX[1]) + 2, sharedArray.length / 2)

    const data = simplify(
        sharedArray.subarray(from * 2, to * 2),
        resolution, true)

    console.timeEnd('simplifyInner')

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
