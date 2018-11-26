type ChannelId = number

interface ChannelDefinition {
    id: ChannelId,
    name: string,
    unit: string
}

interface DataPoint {
    time: number,
    value: number
}

type ChannelData = Array<DataPoint>


let channelDefinitions: Array<ChannelDefinition>
let data: Array<ChannelData>
let totalDuration: number = 0

let channelTestParams: Array<any>

const onChangeHandlers = new Set()

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
    let max = 10 ** (Math.random() * 16) + min
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
    onChangeHandlers.forEach(handler => handler())
}

function onChange(handler: () => void) {
    onChangeHandlers.add(handler)
}

async function init() {
    const timeInterval = 0.05 // 20 data points per second
    await loadChannelDefinitions('channelDefinitions.txt')
    await generateTestData({ timeInterval, count: 2000 })
    console.log(channelDefinitions)
    console.log(data)
    triggerOnChange()
    /*setInterval(() => {
        totalDuration += timeInterval
        channelDefinitions.forEach(channel => generateOneDataPoint(channel.id))
        triggerOnChange()
    }, 10)*/
}

export default { getChannelDefinitions, onChange, getAllData, getTotalDuration }

init()
