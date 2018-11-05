import React from 'react';
import { Line } from 'react-chartjs-2';
import dataManager from '../managers/dataManager';


export default (props) => {
    const entries = dataManager.getData(3);
    if (!entries)
        return null;

    const options = {
        responsive: true,
        title: {
            display: true,
            text: 'Chart.js Time Point Data'
        },
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    displayFormats: {
                        millisecond: 'ss.SSS'
                    },
                    unit: "second",
                    round: "second"
                }
            }],
        }
    };

    const data = {
        datasets: [{
            label: '# of Votes',
            data: entries.map(entry => ({ x: entry.time * 1000, y: entry.value })),
            borderWidth: 1
        }]
    };

    console.log(data);

    return (
        <div style={{
            height: 400,
            width: 600
        }}>
            <h1>Das ist ein Graph</h1>
            <Line data={data} options={options} width={100} height={50} />
        </div>
    );
}