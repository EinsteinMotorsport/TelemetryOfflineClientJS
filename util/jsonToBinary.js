#!/usr/bin/env node
const fs = require('fs-extra')
const path = require('path')

if (process.argv.length < 4) {
    console.log('Usage: jsonToBinary.js <source files> <destination folder>')
    process.exit(1)
}

const files = process.argv.slice(2, -1)
const destination = process.argv[process.argv.length - 1]

let points = 0

console.log(`Converting ${files.length} files from JSON to binary`)

convertAll()

async function convertAll() {
    for (const file of files) {
        await convert(file)
    }
    console.log(`Done. Converted ${points} data points`)
}

async function convert(file) {
    const raw = await fs.readFile(file, 'utf-8')
    const data = JSON.parse(raw)
    points += data.length

    const binary = new Float64Array(data.length * 2)
    for (let i = 0; i < data.length; i++) {
        binary[i * 2] = data[i].time
        binary[i * 2 + 1] = data[i].value
    }

    const filePath = path.resolve(destination, path.basename(file, '.json') + '.offlinechannel')
    await fs.writeFile(filePath, binary)
}
