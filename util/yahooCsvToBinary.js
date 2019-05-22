#!/usr/bin/env node
const fs = require('fs-extra')
const path = require('path')

if (process.argv.length < 4) {
    console.log('Usage: csvToBinary.js <source files> <destination folder>')
    process.exit(1)
}

const files = process.argv.slice(2, -1)
const destination = process.argv[process.argv.length - 1]

let points = 0

console.log(`Converting ${files.length} files from Yahoo Stock CSV to binary`)

convertAll()

async function convertAll() {
    for (const file of files) {
        await convert(file)
    }
    console.log(`Done. Converted ${points} data points`)
}

async function convert(file) {
    const raw = await fs.readFile(file, 'utf-8')
    const lines = raw.split('\n')
    lines.pop() // empty line at end
    lines.shift() // title line

    points += lines.length

    let time = 0

    const binary = new Float64Array(lines.length * 2)
    for (let i = 0; i < lines.length; i++) {
        const splitted = lines[i].split(',')
        //binary[i * 2] = Math.ceil(new Date(splitted[0]).getTime() / 1000 / 60 / 60 / 24)
        binary[i * 2] = time
        binary[i * 2 + 1] = parseFloat(splitted[5]) // Adj Close col

        time += 0.02
    }

    const filePath = path.resolve(destination, path.basename(file, '.csv') + '.offlinechannel')
    await fs.writeFile(filePath, binary)
}
