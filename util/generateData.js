#!/usr/bin/env node
const fs = require('fs-extra')
const path = require('path')

if (process.argv.length !== 5) {
    console.error('Usage: generateData.js <destination file> <duration in seconds> <points per second>')
    process.exit(1)
}

const destination = process.argv[2]
const duration = parseInt(process.argv[3])
const pointsPerSecond = parseInt(process.argv[4])

if (isNaN(duration)) {
    console.error(`Invalid number "${process.argv[3]}"`)
    process.exit(1)
}
if (isNaN(pointsPerSecond)) {
    console.error(`Invalid number "${process.argv[4]}"`)
    process.exit(1)
}

const totalPoints = duration * pointsPerSecond

console.log(`Generating ${totalPoints} points…`)

generate()

async function generate(file) {
    const binary = new Float64Array(totalPoints * 2)

    const params = generateTestParams()

    let time = 0
    for (let i = 0; i < totalPoints; i++) {
        const value = generateValue(params)
        binary[i * 2] = time
        binary[i * 2 + 1] = value

        time += 1 / pointsPerSecond
    }

    await fs.writeFile(destination, binary)
}

function generateTestParams() {
    let min = 10 ** (Math.random() * 4)
    let max = 10 ** (Math.random() * 8) + min

    let volatility = 1.15 ** (Math.random() * 25)
    return {
        min,
        max,
        volatility,
        lastValue: min + Math.random() * (max - min)
    }
}

function generateValue(params) {
    let value = params.lastValue + (Math.random() - 0.5) * Math.random() * (params.max - params.min) / 10 * params.volatility
    value = Math.min(value, params.max)
    value = Math.max(value, params.min)
    params.lastValue = value
    return value
}
