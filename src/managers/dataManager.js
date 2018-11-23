let channelDefinitions
let data
let totalDuration = 0
const onChangeHandlers = new Set()

async function loadChannelDefinitions(file) {
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


function generateTestData({ timeInterval, duration }) {
    data = []
    channelDefinitions
        .forEach(channel => {
            data[channel.id] =
                generateTestDataForChannel({ channel, timeInterval, duration })
        })
}

function generateTestDataForChannel({ channel, timeInterval, duration }) {
    channel.min = (Math.random() - 0.5) * 10 ** (Math.random() * 16 - 8)
    channel.max = 10 ** (Math.random() * 16) + channel.min
    if (channel.unit === 'Bool') {
        channel.min = 0
        channel.max = 1
    }
    const data = []
    const value = channel.min + Math.random() * (channel.max - channel.min)
    data.push({
        time: 0,
        value
    })
    channel.time = 0
    for (let time = timeInterval; time <= duration; time += timeInterval) {
        generateTestDataPoint({ channel, channelData: data, timeInterval })
    }
    return data
}

function generateTestDataPoint({ channel, channelData, timeInterval }) {
    const last = channelData[channelData.length - 1 ]
    channel.time += timeInterval
    if (totalDuration < channel.time)
        totalDuration = channel.time
    if (Math.random() < channel.id * 0.007) // Messpunkt fällt aus
        return
    
    let value = last.value + (Math.random() - 0.5) * Math.random() * (channel.max - channel.min) / 5
    value = Math.min(value, channel.max)
    value = Math.max(value, channel.min)
    channelData.push({
        time: channel.time,
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

function onChange(handler) {
    onChangeHandlers.add(handler)
}

async function init() {
    const timeInterval = 0.05 // 20 data points per second
    await loadChannelDefinitions('channelDefinitions.txt')
    console.log(channelDefinitions)
    await generateTestData({ timeInterval, duration: 100 })
    console.log(data)
    triggerOnChange()
    /*setInterval(() => {
        channelDefinitions.forEach(channel => {
            generateTestDataPoint({
                channel, 
                channelData: data[channel.id],
                timeInterval
            })
        })
        triggerOnChange()
    }, 10) */
}

export default { getChannelDefinitions, onChange, getAllData, getTotalDuration }

init()
