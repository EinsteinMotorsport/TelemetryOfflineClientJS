import { DataSupplier, SubRequest, SubEventHandler, ChannelData, DataRetriever, SubEvent } from './typeDefs'
import HttpDataRetriever from './HttpDataRetriever'
import { getIndexBeforeX, getDomainWithOverlap } from '../util'
import simplify from '../util/simplify'

interface Subscription {
    subRequest: SubRequest
    changeHandler: SubEventHandler
}

interface CacheEntry {
    request: SubRequest
    channelData: ChannelData
    pendingRemove: boolean
}

export default class MyDataSupplier implements DataSupplier {
    private dataRetriever: DataRetriever = new HttpDataRetriever()
    private subscriptions: Array<Subscription> = []
    private cache: Array<CacheEntry> = []
    private retrieving: boolean = false // if a retrieval is already in progress


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
        // Remember which entry should be removed
        const lastPendingRemovals = this.cache.filter(entry => entry.pendingRemove)
        // Set all cache entries to for removal and set the ones that are in use to false later
        for (const entry of this.cache) {
            entry.pendingRemove = true
        }
        
        let toRetrieve = null // What to retrieve
        for (const subscription of this.subscriptions) {
            const { bestEntry, fullMatch } = this.findMatchingCacheEntry(subscription.subRequest)
            if (bestEntry)
                bestEntry.pendingRemove = false // This Cache entry is still in use

            subscription.changeHandler({
                type: "channelData",
                channelData: bestEntry ? bestEntry.channelData : [],
                fullyLoaded: fullMatch
            })
            if (!fullMatch && toRetrieve === null)
                toRetrieve = subscription.subRequest
        }

        // Cleanup
        for (const entry of lastPendingRemovals) {
            if (entry.pendingRemove) { // Nur die entfernen, die immer noch entfernt werden sollen
                const index = this.cache.indexOf(entry)
                this.cache.splice(index, 1)
            }
        }

        if (!this.retrieving && toRetrieve) { // Only retrieve if no other retrieval is already in progress
            this.retrieve(toRetrieve)
        }

        //console.log(this.cache)
    }

    /**
     * Returns the best matching cache entry
     * @param subRequest 
     */
    private findMatchingCacheEntry(subRequest: SubRequest): {
        bestEntry: CacheEntry | null
        fullMatch: boolean
     } {
        const bestResults = this.cache
            .filter(entry => entry.request.channel === subRequest.channel)
            .map(entry => ({ entry, score: this.calculateMatchScore(subRequest, entry.request)}))
            .sort((a, b) => b.score - a.score)

        //console.log(bestResults)

        const bestResult = bestResults[0]

        if (!bestResult)
            return {
                bestEntry: null,
                fullMatch: false
            }

        //console.log("Requested:", subRequest, "Got:", bestResult.entry.request)
        
        return {
            bestEntry: bestResult.entry,
            fullMatch: bestResult.score >= 1 // If Score >= 1, the CacheEntry fullfilles the request fully
        }
    }

    /**
     * Rates how good the cacheRequest matches the subRequest
     * >= 1 means full match
     * @param subRequest 
     * @param cacheRequest 
     */
    private calculateMatchScore(subRequest: SubRequest, cacheRequest: SubRequest): number {
        if (cacheRequest.type !== subRequest.type)
            return 0

        if (cacheRequest.channel !== subRequest.channel)
            return 0

        // Only consider the part of cacheRequest's domain that is inside subRequest's domain
        const left = Math.max(cacheRequest.domainX[0], subRequest.domainX[0])
        const right = Math.min(cacheRequest.domainX[1], subRequest.domainX[1])
        const cacheLength = right - left
        const subLength = subRequest.domainX[1] - subRequest.domainX[0]

        // Do not consider the resolution of cacheRequest if it is more accurately than subRequest's
        const resolution = Math.max(cacheRequest.resolution, subRequest.resolution)

        const score = (cacheLength / subLength) * (subRequest.resolution / resolution)
        // score should not be able to be greater than 1

        return score

        // todo unnötig detaillierte oder große Cache-Einträge nicht bevorzugen und evtl. sogar mit Score < 1 bewerten
    }

    /**
     * Retrieves the data
     * Only call if this.retrieving is false
     * @param subRequest 
     */
    private async retrieve(subRequest: SubRequest) {
        const generatedRequest = {
            ...subRequest,
            domainX: getDomainWithOverlap(subRequest.domainX) // Retrieve a bit more than necessary because the user might pan and zoom
        } 
        this.retrieving = true
        try {
            const channelData = await this.retrieveChannelData(generatedRequest)
            this.cache.push({
                request: generatedRequest,
                channelData,
                pendingRemove: false
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
    private async retrieveChannelData(request: SubRequest): Promise<ChannelData> {
        const channelData = await this.dataRetriever.retrieveChannelData(request.channel)
        
        if (channelData === "notFound") {
            return channelData
        }
        
        console.time("simplify")

        const from = Math.max(getIndexBeforeX(channelData, request.domainX[0]), 0)
        const to = Math.min(getIndexBeforeX(channelData, request.domainX[1]) + 2, channelData.length)

        const data = simplify(
            channelData.slice(from, to),
            request.resolution, false)

        console.timeEnd("simplify")

        return data
            
        /*const ratio = Math.floor((to - from) / 1000)
        return channelData
            .slice(from, to)
            .filter((_, index) => index % ratio === 0) // Todo*/
    }
}
