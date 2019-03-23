import { DataRetriever, SubRequest, ChannelData, ChannelDefinition, ChannelId } from "./typeDefs";

export default class HttpDataRetriever implements DataRetriever {
    async retrieveChannelDefinitions(): Promise<Array<ChannelDefinition>> {
        throw new Error("Not implemented")
    }

    async retrieveChannelData(channel: ChannelId): Promise<ChannelData> {
        const response = await fetch(`channelData/${channel}.json`)
        if (response.status !== 200)
            return "notFound"
        try {
            return await response.json()
        } catch(e) {
            console.error("Error loading json", e)
            return "notFound"
        }
    }
}
