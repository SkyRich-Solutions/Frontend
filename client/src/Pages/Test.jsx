import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import Counter from '../Components/Counter';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const JSONTable = () => {
    const [UnProcessedData, setUnProcessedData] = useState([]);
    const [ProcessedData, setProcessedData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState(null);

    console.log('UnProcessedData', UnProcessedData);
    console.log('ProcessedData', ProcessedData);

    // Fetch data from backend API
    useEffect(() => {
        const fetchUnprocessedData = async () => {
            try {
                const response = await fetch(
                    'http://localhost:4000/test/getJSON'
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const jsonData = await response.json();
                setUnProcessedData(jsonData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        const fetchProcessedData = async () => {
            try {
                const response = await fetch(
                    'http://localhost:4000/test/getProcessedJSON'
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const jsonData = await response.json();
                setProcessedData(jsonData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUnprocessedData();
        fetchProcessedData();
    }, []);

    // Handle file input change
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Parse CSV file with PapaParse
    const handleFileUpload = () => {
        if (!file) {
            alert('Please select a CSV file first');
            return;
        }

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                const normalizedData = results.data.map((row) => {
                    const normalizedRow = {};
                    Object.keys(row).forEach((key) => {
                        const normalizedKey = key
                            .trim()
                            .replace(/\s+/g, '_')
                            .replace(/\-/g, '_')
                            .replace(/\(.*\)/, '')
                            .replace(
                                /^Batch_Management$/,
                                'Batch_ManagementPlant'
                            )
                            .replace('Serial_No._Profile', 'Serial_No_Profile');
                        normalizedRow[normalizedKey] = row[key] || '';
                    });
                    return normalizedRow;
                });

                try {
                    await axios.post(
                        'http://localhost:4000/test/postJSON',
                        normalizedData
                    );
                    alert('File uploaded successfully!');
                    setUnProcessedData((prevData) => [
                        ...prevData,
                        ...normalizedData
                    ]);
                } catch (err) {
                    alert(
                        'Failed to upload file. Check the console for details.'
                    );
                }
            },
            error: (err) => {
                alert('Error parsing CSV file.');
            }
        });
    };

    if (loading) {
        return <p>Loading data...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    const totalRows = ProcessedData.length;
    const totalViolations = ProcessedData.reduce(
        (sum, item) => sum + item.Violation,
        0
    );

    // Data for Pie Chart
    const pieData = {
        labels: ['Violations', 'Compliant'],
        datasets: [
            {
                data: [totalViolations, totalRows - totalViolations],
                backgroundColor: ['#FF6384', '#36A2EB'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB']
            }
        ]
    };

    return (
        <div>
            <h1>Data Table</h1>

            {/* File Upload Section */}
            <div>
                <h2>Upload CSV File</h2>
                <input type='file' accept='.csv' onChange={handleFileChange} />
                <button onClick={handleFileUpload}>Upload</button>
            </div>

            <br />

            {/* Pie Chart Section */}
            <div>
                <h2>Violation Summary</h2>
                <Pie data={pieData} className='h-14 w-14' />
                <div className='text-2xl'>
                    <span>Violations Count: </span>
                    <Counter
                        from={0}
                        to={totalViolations}
                        separator=','
                        duration={1}
                    />
                </div>
            </div>

            <br />

            {/* Data Tables */}
            <div>
                <div className='text-4xl'>Unprocessed Data</div>
                <table className='border-spacing-2 border-2 border-black'>
                    <thead>
                        <tr>
                            {Object.keys(UnProcessedData[0]).map((key) => (
                                <th key={key}>{key}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {UnProcessedData.slice(0, 10).map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {Object.values(row).map((value, colIndex) => (
                                    <td key={colIndex}>{value}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

                <br />

                <div className='text-4xl'>Processed Data</div>
                <table className='border-spacing-2 border-2 border-black'>
                    <thead>
                        <tr>
                            {Object.keys(ProcessedData[0]).map((key) => (
                                <th key={key}>{key}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {ProcessedData.slice(0, 10).map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {Object.values(row).map((value, colIndex) => (
                                    <td key={colIndex}>{value}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default JSONTable;
