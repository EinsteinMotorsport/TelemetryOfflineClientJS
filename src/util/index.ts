import { ChannelData } from '../data/ChannelData'
import { getDomainWithOverlap as getDomainWithOverlapOld, getOverlappingArea as getOverlappingAreaOld, getArea as getAreaOld } from './old'

export const getIndexByTime = (channelData: ChannelData, time: number): number => {
    let start = 0
    let end = channelData.length - 1

    if (end <= 0)
        return end

    let middle = Math.floor((end + start) / 2)
    while (start < end) {
        const currTime = channelData.getTime(middle)
        if (time < currTime){
            end = middle - 1
        } else if (time > currTime) {
            start = middle + 1
        } else {
            return middle
        }

        middle = Math.floor((end + start) / 2)
    } 

    if (channelData.getTime(middle) > time)
        middle--

    middle = Math.max(middle, 0)

    console.log(`${channelData.getTime(middle)} < ${time} < ${channelData.length > middle + 1 ? channelData.getTime(middle + 1) : "-"}`)
    return middle
}

export const getClosestDataPoint = (channelData: ChannelData, time: number) => {
    const index = getIndexByTime(channelData, time)
    const before = channelData.length > index ? channelData.getPoint(index) : null
    const after = channelData.length > index + 1 ? channelData.getPoint(index + 1) : null
    let item
    if (!before && !after)
        item = null
    else if (!before)
        item = after
    else if (!after)
        item = before
    else
        item = Math.abs(before.time - time) < Math.abs(after.time - time) ? before : after

    return item
}

// TODO
export const getDomainWithOverlap = getDomainWithOverlapOld
export const getOverlappingArea = getOverlappingAreaOld
export const getArea = getAreaOld
