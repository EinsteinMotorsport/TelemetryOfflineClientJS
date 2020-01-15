import { getIndexByTime } from "../util";

export type RawChannelData = RawEmptyChannelData | RawFloat64Float64ChannelData

interface RawEmptyChannelData {
    type: 'EMPTY'
}

interface RawFloat64Float64ChannelData {
    type: 'FLOAT64_FLOAT64'
    data: Float64Array
}

export interface DataPoint {
    time: number
    value: number
}

export interface ChannelData {
    getTime(index: number): number
    getValue(index: number): number
    getPoint(index: number): DataPoint
    subdataByIndex(fromIndex: number, toIndex: number): ChannelData
    subdataByTime(fromTime: number, toTime: number): ChannelData
    asRaw(): RawChannelData
    length: number
}

export function createChannelDataWrapper(rawChannelData: RawChannelData): ChannelData {
    switch (rawChannelData.type) {
        case 'EMPTY':
            return new EmptyChannelData();
        case 'FLOAT64_FLOAT64':
            return new Float64Float64ChannelData(rawChannelData);
    }
}

export class EmptyChannelData implements ChannelData {
    getTime(index: number): number { throw new Error('Out of bounds') }
    getValue(index: number): number { throw new Error('Out of bounds') }
    getPoint(index: number): DataPoint { throw new Error('Out of bounds') }
    get length() { return 0 }
    subdataByIndex(fromIndex: number, toIndex: number): EmptyChannelData { return this }
    subdataByTime() { return this }
    asRaw(): RawChannelData { 
        return { type: "EMPTY" }
    }
}

export class Float64Float64ChannelData implements ChannelData {
    private rawChannelData: RawFloat64Float64ChannelData
    public readonly length: number

    constructor(rawChannelData: RawFloat64Float64ChannelData) {
        this.rawChannelData = rawChannelData
        if (rawChannelData.data.length % 2 !== 0)
            throw new Error(`Raw channel data length must be modulo 2 (is ${rawChannelData.data.length})`)
        this.length = rawChannelData.data.length / 2
    }

    getTime(index: number): number {
        this.boundCheck(index)
        return this.rawChannelData.data[index * 2]
    }
    getValue(index: number): number {
        this.boundCheck(index)
        return this.rawChannelData.data[index * 2 + 1]
    }
    getPoint(index: number): DataPoint { 
        this.boundCheck(index)
        return {
            time: this.getTime(index),
            value: this.getValue(index)
        }
    }
    subdataByIndex(fromIndex: number, toIndex: number): ChannelData {
        this.boundCheck(fromIndex)
        this.boundCheck(toIndex - 1)
        const raw = {
            ...this.rawChannelData,
            data: this.rawChannelData.data.subarray(fromIndex * 2, toIndex * 2)
        }
        return new Float64Float64ChannelData(raw)
    }
    subdataByTime(fromTime: number, toTime: number): ChannelData {
        const from = getIndexByTime(this, fromTime)
        const to = Math.min(getIndexByTime(this, toTime) + 1, this.length - 1) + 1
        return this.subdataByIndex(from, to)
    }
    asRaw(): RawChannelData {
        return this.rawChannelData
    }

    private boundCheck(index: number) {
        if (index >= this.length || index < 0)
            throw new Error('Out of bounds')
    }

}
