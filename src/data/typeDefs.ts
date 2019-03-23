
export type SubEventHandler = (event: SubEvent) => void
export type ChannelId = number
export type Domain = Array<number> // Range of ChannelData, Array has size 2
export type ChannelData = Array<DataPoint> | "notFound"

/**
 * Describes a channel
 */
export interface ChannelDefinition {
    id: ChannelId
    name: string
    unit: string
}

export default interface DataPoint {
    time: number
    value: number
}

// Subscription Request
export type SubRequest = ChannelDataSubRequest //| TotalDurationSubRequest | ChannelDefinitionsSubRequest TODO

/*export interface TotalDurationSubRequest {
    type: "totalDuration"
    //source: string
}

export interface ChannelDefinitionsSubRequest {
    type: "channelDefinitions"
    //source: string
}*/

export interface ChannelDataSubRequest {
    type: "channelData"
    //source: string
    channel: ChannelId
    domainX: Domain
    resolution: number // tolerance => amount the provided data may deviate from the original
}

/**
 * Subscribe Event that is passed to a SubEventHandler with new ChannelData or other stuff
 */
export type SubEvent = ChannelDataSubEvent | "error"

export interface ChannelDataSubEvent {
    type: "channelData"
    fullyLoaded: boolean // if the data is completly loaded
    channelData: ChannelData
}

export interface DataSupplier {
    /**
     * The DataSupplier has to call the changeHandler while this function is running
     * @param request 
     * @param changeHandler 
     */
    subscribe(request: SubRequest, eventHandler: SubEventHandler): void
    unsubscribe(request: SubRequest): void
}

export interface DataRetriever {
    retrieveChannelDefinitions(): Promise<Array<ChannelDefinition>>
    retrieveChannelData(channel: ChannelId): Promise<ChannelData>
}
