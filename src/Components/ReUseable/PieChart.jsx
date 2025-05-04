import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const PieChart = ({ chartData, text, searchQuery }) => {
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

    // 🧠 Filtering logic (only applied if chartData and searchQuery are valid)
    const filteredData = React.useMemo(() => {
        if (!chartData || !searchQuery) return chartData;

        const lowerQuery = searchQuery.toLowerCase();
        const newLabels = [];
        const newData = [];
        const newBackgroundColor = [];
        const newBorderColor = [];

        chartData.labels.forEach((label, index) => {
            if (label.toLowerCase().includes(lowerQuery)) {
                newLabels.push(label);
                newData.push(chartData.datasets[0].data[index]);
                newBackgroundColor.push(chartData.datasets[0].backgroundColor[index]);
                newBorderColor.push(chartData.datasets[0].borderColor[index]);
            }
        });

        return {
            labels: newLabels,
            datasets: [
                {
                    ...chartData.datasets[0],
                    data: newData,
                    backgroundColor: newBackgroundColor,
                    borderColor: newBorderColor
                }
            ]
        };
    }, [chartData, searchQuery]);

    return <Pie data={filteredData || defaultData} options={options} />;
};

export default PieChart;
