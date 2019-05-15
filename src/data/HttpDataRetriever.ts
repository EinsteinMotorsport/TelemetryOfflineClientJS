import { DataRetriever, ChannelData, ChannelDefinition, ChannelId } from './typeDefs'

export default class HttpDataRetriever implements DataRetriever {
    async retrieveChannelDefinitions(): Promise<Array<ChannelDefinition>> {
        const response = await fetch('channelDefinitions.txt')
        const text = await response.text()
        const result: Array<ChannelDefinition> = []
        text.trim().split('\n')
            .forEach((line, index) => {
                const columns = line.split('~')
                const id = parseInt(columns[0])
                if (isNaN(id)) {
                    throw new Error(`Invalid channel id: "${columns[0]}"\nline: ${index + 1}`)
                }
                if (result[id] != null) {
                    throw new Error(`Duplicate channel id ${id} (line ${index + 1})`)
                }
                result[id] = {
                    id,
                    name: columns[1],
                    unit: columns[2]
                }
            })
        return result
    }

    async retrieveChannelData(channel: ChannelId): Promise<ArrayBuffer|'notFound'> {
        const response = await fetch(`channelData/${channel}.offlinechannel`)
        if (response.status !== 200)
            return "notFound"
        try {
            return await response.arrayBuffer()
        } catch (e) {
            console.error("Error loading json", e)
            return "notFound"
        }
    }
}
