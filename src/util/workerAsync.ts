
export function createWorkerFunction(MyWorker: any): (...args: any[]) => Promise<any> {
    const worker: Worker = new MyWorker()
    const resolutions: Array<(value?: any) => void> = []
    worker.addEventListener('message', (event: any) => {
        const resolve = resolutions.shift()!
        resolve(event.data)
    })

    return (...args) => {
        console.time("post")
        return new Promise(resolve => {
            resolutions.push(resolve)
            worker.postMessage(args)
            console.timeEnd("post")
        })
        
    }
}

export function registerWorker(context: Worker, callback: (...args: Array<any>) => any) {
    context.addEventListener('message', event => {
        let result
        try {
            result = callback(...event.data)
        } catch (e) {
            console.error('Worker error', e)
            result = null
        }
        context.postMessage(result)
    })
}
