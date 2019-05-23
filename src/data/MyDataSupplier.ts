import { DataSupplier, SubRequest, SubEventHandler, ChannelData, DataRetriever, ChannelDataSubRequest } from './typeDefs'
import HttpDataRetriever from './HttpDataRetriever'
import { getDomainWithOverlap, getOverlappingArea, getArea } from '../util'
import { createWorkerFunction } from '../util/workerAsync'
import DataRetrieverWorker from '../worker/DataRetriever.worker'

interface Subscription {
    subRequest: SubRequest
    changeHandler: SubEventHandler
}

interface CacheEntry {
    request: ChannelDataSubRequest
    channelData: ChannelData
    expiration?: number
}

export default class MyDataSupplier implements DataSupplier {
    private dataRetriever: DataRetriever = new HttpDataRetriever()
    private subscriptions: Array<Subscription> = []
    private cache: Array<CacheEntry> = []
    private retrieving: boolean = false // if a retrieval is already in progress
    private totalDuration = 0.02 * 50 * 60 * 15


    subscribe(request: SubRequest, changeHandler: SubEventHandler): void {
        this.subscriptions.push({
            subRequest: request,
            changeHandler
        })
        this.updateCache()
    }

    unsubscribe(request: SubRequest): void {
        this.removeSubscription(request)
        this.updateCache()
    }

    /**
     * Retrieves missing cache entries,
     *  removes no longer needed ones
     *  and notifies the subscribers
     */
    private updateCache() {
        // Set all cache entries to for removal and set the ones that are in use to undefined later
        for (const entry of this.cache) {
            if (entry.expiration === undefined)
                entry.expiration = Date.now() + 1e3 // Should expire in 1 second
        }

        let toRetrieve: ChannelDataSubRequest | null = null // What to retrieve
        for (const subscription of this.subscriptions) {
            switch (subscription.subRequest.type) {
                case 'totalDuration':
                    subscription.changeHandler({
                        type: 'totalDuration',
                        totalDuration: this.totalDuration
                    })
                    break
                case 'channelData':
                    const { bestEntry, fullMatch } = this.findMatchingCacheEntry(subscription.subRequest)
                    if (bestEntry)
                        bestEntry.expiration = undefined // This Cache entry is still in use

                    subscription.changeHandler({
                        type: "channelData",
                        channelData: bestEntry ? bestEntry.channelData : [],
                        fullyLoaded: fullMatch
                    })
                    if (!fullMatch && toRetrieve === null)
                        toRetrieve = subscription.subRequest
            }
        }

        // Cleanup
        for (const entry of this.cache) {
            if (entry.expiration !== undefined && entry.expiration <= Date.now()) {
                const index = this.cache.indexOf(entry)
                this.cache.splice(index, 1)
            }
        }

        if (!this.retrieving && toRetrieve) { // Only retrieve if no other retrieval is already in progress
            this.retrieve(toRetrieve)
        }
    }

    /**
     * Returns the best matching cache entry
     * @param subRequest 
     */
    private findMatchingCacheEntry(subRequest: ChannelDataSubRequest): {
        bestEntry: CacheEntry | null
        fullMatch: boolean
    } {
        const bestResults = this.cache
            .map(entry => ({ entry, score: this.calculateMatchScore(subRequest, entry.request) }))
            .filter(entry => entry.score >= 0) // Score < 0 means useless for the request
            .sort((a, b) => b.score - a.score)

        const bestResult = bestResults[0]

        if (!bestResult) {
            return {
                bestEntry: null,
                fullMatch: false
            }
        }

        return {
            bestEntry: bestResult.entry,
            fullMatch: bestResult.score >= 1000 // If Score > 1000, the CacheEntry fullfilles the request fully
        }
    }

    /**
     * Rates how good the cacheRequest matches the subRequest
     * score < 0 Does not make any sense to use this cacheRequest for this subRequest (e.g. wrong channel)
     * 0 <= score < 1000: Useful but request is not fully satisfied (e.g. only partly covered; resolution too low)
     * 1000 <= score < 2000: Fully satisfied but still room for a better option. If idle can retrieve bet version (e.g. cache domainX larger; cache resolution larger)
     * 2000 <= score: Fully satisfied; There cannot be any better option
     * @param subRequest 
     * @param cacheRequest 
     */
    private calculateMatchScore<T>(subRequest: ChannelDataSubRequest, cacheRequest: ChannelDataSubRequest): number {
        if (cacheRequest.type !== 'channelData' || subRequest.type !== 'channelData')
            return -2

        if (cacheRequest.channel !== subRequest.channel)
            return -1

        if (subRequest.domainX[0] === cacheRequest.domainX[0]
            && subRequest.domainX[1] === cacheRequest.domainX[1]
            && subRequest.resolution === cacheRequest.resolution) // Perfect match
            return 2000

        const overlapArea = getOverlappingArea(subRequest.domainX, cacheRequest.domainX)
        const subRequestArea = getArea(subRequest.domainX)
        let areaRatio
        if (subRequestArea === 0) { // Then it only wants the 1 point nearest to domainX
            if (cacheRequest.domainX[1] >= cacheRequest.domainX[0] 
                && cacheRequest.domainX[0] <= subRequest.domainX[0]
                && cacheRequest.domainX[1] >= subRequest.domainX[1]
                ) { // cache contains this point?
                    areaRatio = 1 // Perfect
                } else {
                    areaRatio = 0 // Useless
                }
        } else {
            areaRatio = overlapArea / subRequestArea // Calc the ratio the cache covers the request area
        }

        // Do not consider the resolution of cacheRequest if it is more accurately than subRequest's
        const resolution = Math.max(cacheRequest.resolution, subRequest.resolution) 
        // if resolution is 0 (cache and request resolution is 0) => perfect
        const resolutionRatio = resolution === 0 ? 1 : subRequest.resolution / resolution

        const score = areaRatio * resolutionRatio * 1000
        // Score should now be something between 0 and 1000

        return score

        // todo unnötig detaillierte oder große Cache-Einträge nicht bevorzugen und evtl. sogar mit Score < 1000 bewerten
    }

    /**
     * Retrieves the data
     * Only call if this.retrieving is false
     * @param subRequest 
     */
    private async retrieve(subRequest: ChannelDataSubRequest) {
        const generatedRequest = {
            ...subRequest,
            domainX: getDomainWithOverlap(subRequest.domainX) // Retrieve a bit more than necessary because the user might pan and zoom
        }
        this.retrieving = true
        try {
            const channelData = await this.retrieveChannelData(generatedRequest)
            this.cache.push({
                request: generatedRequest,
                channelData
            })
        } finally {
            this.retrieving = false
        }

        this.updateCache()
    }

    /**
     * Removes the subscriptions from this.subscriptions
     * @param subRequest 
     */
    private removeSubscription(subRequest: SubRequest): Subscription | null {
        for (let i = 0; i < this.subscriptions.length; i++) {
            if (this.subscriptions[i].subRequest === subRequest) {
                const subscription = this.subscriptions[i]
                this.subscriptions.splice(i, 1)
                return subscription
            }
        }
        return null
    }

    /**
     * Retrieves the channel data
     * @param request 
     */
    private async retrieveChannelData(request: ChannelDataSubRequest): Promise<ChannelData> {
        console.time('retrieve')
        const data = this.dataRetriever.retrieveChannelData(request);
        console.timeEnd("retrieve")
        return data
    }
}
