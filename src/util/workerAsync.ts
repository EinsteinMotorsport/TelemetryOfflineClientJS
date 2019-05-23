let resolutionIdCounter = 0

export function createWorkerFunction(MyWorker: any): (...args: any[]) => Promise<any> {
    const worker: Worker = new MyWorker()
    const resolutions: Map<number, (value?: any) => void> = new Map()

    worker.addEventListener('message', (event: any) => {
        const id = event.data.resolutionId
        const resolve = resolutions.get(id)!
        resolutions.delete(id)
        resolve(event.data.returnValue)
    })

    return (...args) => {
        const id = resolutionIdCounter++
        return new Promise(resolve => {
            resolutions.set(id, resolve)
            worker.postMessage({
                resolutionId: id,
                args
            })
        })
        
    }
}

export function registerWorker(context: Worker, callback: (...args: Array<any>) => any) {
    context.addEventListener('message', async event => {
        const id = event.data.resolutionId
        let result
        try {
            result = await callback(...event.data.args)
        } catch (e) {
            console.error(`Worker error ${id}`, e)
            result = null // todo reject
        }
        context.postMessage({
            resolutionId: id,
            returnValue: result
        })
    })
}
