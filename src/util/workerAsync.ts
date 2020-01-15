let resolutionIdCounter = 0

export function createWorkerFunction(MyWorker: any): (...args: any[]) => Promise<any> {
    const worker: Worker = new MyWorker()
    const resolutions: Map<number, { resolve: (value?: any) => void, reject: (value?: any) => void }> = new Map()

    worker.addEventListener('message', (event: any) => {
        const id = event.data.resolutionId
        const { resolve, reject } = resolutions.get(id)!
        resolutions.delete(id)
        if (event.data.success)
            resolve(event.data.returnValue)
        else
            reject(event.data.returnValue)
    })

    return (...args) => {
        const id = resolutionIdCounter++
        return new Promise((resolve, reject) => {
            resolutions.set(id, { resolve, reject })
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
            context.postMessage({
                resolutionId: id,
                success: true,
                returnValue: result
            })
        } catch (e) {
            console.error("Error in worker", e)
            context.postMessage({
                resolutionId: id,
                success: false,
                returnValue: e.toString()
            })
        }
        
    })
}
