let channelDefinitions;
let data;

async function loadChannelDefinitions(file) {
    const response = await fetch(file);
    const text = await response.text();
    channelDefinitions = text.trim().split("\n")
        .map((line, index) => {
            const columns = line.split("~")
            const id = parseInt(columns[0]);
            if (isNaN(id)) {
                throw new Error(`Invalid channel id: "${columns[0]}"\nline: ${index + 1}`);
            }
            return {
                id,
                name: columns[1],
                unit: columns[2]
            };
        })
    console.info(`Imported ${channelDefinitions.length} channels`);
    // TODO Check auf doppelte und ungültige IDs
}


function generateTestData({ valuesPerSecond, duration }) {
    data = [];
    channelDefinitions
        .forEach(channel => {
            data[channel.id] =
                generateTestDataForChannel({ channel, valuesPerSecond, duration })
        });
}

function generateTestDataForChannel({ channel, valuesPerSecond, duration }) {
    // TODO manchmal sollen Werte ausfallen
    let min = (Math.random() - 0.5) * 10 ** (Math.random() * 16 - 8);
    let max = 10 ** (Math.random() * 16 + min);
    if (channel.unit === "Bool") {
        min = 0;
        max = 1;
    }
    const data = [];
    let value = min + Math.random() * (max - min);
    for (let time = 0; time <= duration; time += (1 / valuesPerSecond)) {
        value = value + (Math.random() - 0.5) * Math.random() * (max - min) / 5;
        value = Math.min(value, max);
        value = Math.max(value, min);
        data.push({
            time,
            value
        });
    }
    if (channel.unit === "Bool") {
        data.forEach(entry => entry.value = Math.round(entry.value));
    }
    return data;
}

function getData(channel) {
    if (!data)
        return null;
    return data[channel];
}

function getChannelDefinitions() {
    return channelDefinitions;
}

async function init() {
    await loadChannelDefinitions("channelDefinitions.txt");
    console.log(channelDefinitions);
    await generateTestData({ valuesPerSecond: 20, duration: 100 });
    console.log(data);
}

export default { getData, getChannelDefinitions }; 

init();
