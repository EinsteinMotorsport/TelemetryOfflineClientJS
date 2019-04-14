import { useEffect, useRef } from 'react'

/**
 * This worker only executes the last task assigned
 */
const useWorker = ({
    Worker,
    handler
}) => {
    const worker = useRef(null)
    const busy = useRef(false)
    const nextTask = useRef(null)

    const sendNextTask = () => {
        const task = nextTask.current
        busy.current = true
        nextTask.current = null
        worker.current.postMessage(task)
    }

    useEffect(() => {
        worker.current = new Worker()
        worker.current.addEventListener('message', event => {
            busy.current = false

            handler(event.data, nextTask.current === null)
            
            if (nextTask.current !== null) {
                sendNextTask()
            }
        })
        if (nextTask.current !== null) {
            sendNextTask()
        }
        return () => {
            worker.current.terminate()
        }
    }, [])

    return {
        setTask(task) {
            nextTask.current = task
            if (busy.current === false && worker.current !== null) {
                sendNextTask()
            }
        }
    } // Todo Das ist eig gar nicht die "React-Art" das zu machen mit Handlern und so. Eig sollte man alles einfach als Argument übergeben und das Ergebnis returnen
}

export default useWorker
