
export default {}

/*export function generateTestData({ timeInterval, count }: { timeInterval: number, count: number }) {
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
}*/
