import simplify from '../util/simplify.js'

import { getIndexBeforeX, getDomainWithOverlap } from "../util"

type ChannelId = number
type Domain = Array<number>

interface ChannelDefinition {
    id: ChannelId,
    name: string,
    unit: string
}

interface DataPoint {
    time: number,
    value: number
}

interface DataRequest {
    channel: ChannelId,
    domainX: Domain,
    resolution: number // Number of points
}

type ChannelData = Array<DataPoint>
type ChangeHandler = (dataPoints: ChannelData | null) => void
type SupplierInfo = { changeHandler: ChangeHandler, cachedRequest: DataRequest }
type CacheEntry = { dataPoints: ChannelData | null, counter: number }

let channelDefinitions: Array<ChannelDefinition>
let data: Array<ChannelData>
let totalDuration: number = 0

let channelTestParams: Array<any>

const onChangeHandlers = new Set()

const subscribedSuppliers = new Map<DataRequest, SupplierInfo>()
const cachedData = new Map<DataRequest, CacheEntry>()

async function loadChannelDefinitions(file: string) {
    const response = await fetch(file)
    const text = await response.text()
    channelDefinitions = []
    text.trim().split('\n')
        .forEach((line, index) => {
            const columns = line.split('~')
            const id = parseInt(columns[0])
            if (isNaN(id)) {
                throw new Error(`Invalid channel id: "${columns[0]}"\nline: ${index + 1}`)
            }
            if (channelDefinitions[id] != null) {
                throw new Error(`Duplicate channel id ${id} (line ${index + 1})`)
            }
            channelDefinitions[id] = {
                id,
                name: columns[1],
                unit: columns[2]
            }
        })
    console.info(`Imported ${channelDefinitions.length} channels`)
}

async function loadChannelData(file: string) {
    const response = await fetch(file)
    data = await response.json()
}


function generateTestData({ timeInterval, count }: { timeInterval: number, count: number }) {
    data = []
    channelTestParams = channelDefinitions.map(channel => generateTestParams(channel))
    for (let i = 0; i < count; i++) {
        totalDuration += timeInterval
        channelDefinitions.forEach(channel => generateOneDataPoint(channel.id))
    }
}

function generateTestParams(channel: ChannelDefinition) {
    data[channel.id] = []
    let min = (Math.random() - 0.5) * 10 ** (Math.random() * 16 - 8)
    let max = 10 ** (Math.random() * 8) + min
    if (channel.unit === 'Bool') {
        min = 0
        max = 1
    }
    let volatility = 1.15 ** (Math.random() * 25)
    return {
        min,
        max,
        volatility,
        lastValue: min + Math.random() * (max - min)
    }
}

function generateOneDataPoint(channelId: ChannelId) {
    if (Math.random() < channelId * 0.007) // Messpunkt fällt aus
        return

    const params = channelTestParams[channelId]

    let value = params.lastValue + (Math.random() - 0.5) * Math.random() * (params.max - params.min) / 10 * params.volatility
    value = Math.min(value, params.max)
    value = Math.max(value, params.min)
    params.lastValue = value
    if (channelDefinitions[channelId].unit === 'Bool') {
        value = Math.round(value)
    }
    data[channelId].push({
        time: totalDuration,
        value
    })
}

function getAllData() {
    return data
}

function getChannelDefinitions() {
    return channelDefinitions
}

function getTotalDuration() {
    return totalDuration
}

function triggerOnChange() {
    cachedData.clear() // Clear cache
    onChangeHandlers.forEach(handler => handler())
    subscribedSuppliers.forEach((supplier, request) => {
        //unmatchCacheEntry(request)
        const cachedRequest = matchCacheEntry(request)
        supplier.cachedRequest = cachedRequest
        supplier.changeHandler(cachedData.get(cachedRequest)!.dataPoints)
    })
}

function onChange(handler: () => void) {
    onChangeHandlers.add(handler)
}

function matchCacheEntry(request: DataRequest): DataRequest {
    for (const [key, value] of cachedData.entries()) {
        if (request.channel === key.channel
            && request.domainX[0] >= key.domainX[0] // TODO
            && request.domainX[1] <= key.domainX[1]
            && request.resolution === key.resolution
        ) {
            console.log('Cache hit')
            value.counter++
            return key
        }
    }

    console.log('%cCahe miss', 'color: red')

    const generatedRequest = {
        ...request,
        domainX: getDomainWithOverlap(request.domainX)
    }

    if (!data) {
        cachedData.set(generatedRequest, {
            dataPoints: null,
            counter: 1
        })
        return generatedRequest
    }

    const dataPoints = data[generatedRequest.channel]

    const from = Math.max(getIndexBeforeX(dataPoints, generatedRequest.domainX[0]), 0)
    const to = Math.min(getIndexBeforeX(dataPoints, generatedRequest.domainX[1]) + 2, dataPoints.length)

    let channelData = dataPoints.slice(from, to)

    const ratio = Math.floor(channelData.length / 1000)
    channelData = channelData.filter((_, index) => index % ratio === 0) // Todo
    //channelData = simplify(channelData, (generatedRequest.domainX[1] - generatedRequest.domainX[0]) / generatedRequest.resolution, false)

    cachedData.set(generatedRequest, {
        dataPoints: channelData,
        counter: 1
    })

    return generatedRequest
}

function unmatchCacheEntry(request: DataRequest) {
    const cachedRequest = subscribedSuppliers.get(request)!.cachedRequest
    const entry = cachedData.get(cachedRequest)!
    entry.counter--
    setTimeout(() => {
        if (entry.counter == 0) {
            console.log("Lösche Eintrag")
            cachedData.delete(cachedRequest)
        }
    }, 500)
}

function registerDataSupplier(request: DataRequest, changeHandler: ChangeHandler): ChannelData | null {
    console.time("dataManagerDings")
    const cachedRequest = matchCacheEntry(request)
    console.timeEnd("dataManagerDings")
    subscribedSuppliers.set(request, {
        changeHandler,
        cachedRequest
    })
    return cachedData.get(cachedRequest)!.dataPoints
}

function unregisterDataSupplier(request: DataRequest) {
    unmatchCacheEntry(request)
    subscribedSuppliers.delete(request)
}

async function init() {
    const timeInterval = 0.02 // DataPoint each 20 ms
    totalDuration = 0.02 * 50 * 60 * 15;
    await loadChannelDefinitions('channelDefinitions.txt')
    await loadChannelData('channelData.json')
    //await generateTestData({ timeInterval, count: 50 * 60 * 15 })

    console.log(channelDefinitions)
    //console.log(data)
    triggerOnChange()
    /*setInterval(() => {
        totalDuration += timeInterval
        channelDefinitions.forEach(channel => generateOneDataPoint(channel.id))
        triggerOnChange()
    }, 10)*/
}

export default {
    getChannelDefinitions,
    onChange,
    getAllData,
    getTotalDuration,
    registerDataSupplier,
    unregisterDataSupplier
}

init()
