import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

// Register required elements
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const PieChart = ({ chartData, text }) => {
    const defaultData = {
        labels: ['No Data'],
        datasets: [
            {
                label: 'Color Distribution',
                data: [1],
                backgroundColor: ['rgba(201, 203, 207, 0.6)'],
                borderColor: ['rgba(201, 203, 207, 1)'],
                borderWidth: 1
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: text,
                font: {
                    size: 20
                }
            },
            legend: {
                position: 'top'
            }
        }
    };

    return <Pie data={chartData || defaultData} options={options} />;
};

export default PieChart;
