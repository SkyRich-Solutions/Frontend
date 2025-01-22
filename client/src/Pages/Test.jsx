import React, { useEffect, useState, useRef } from 'react';
import Papa from 'papaparse';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import Counter from '../Components/Counter';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { io } from 'socket.io-client';

ChartJS.register(ArcElement, Tooltip, Legend);

const JSONTable = () => {
    const socket = useRef(null); // Use ref to manage socket connection
    const [UnProcessedData, setUnProcessedData] = useState([]);
    const [ProcessedData, setProcessedData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState(null);
    const [socketMessages, setSocketMessages] = useState([]);
    const [notification, setNotification] = useState('');
    const [processingUpdates, setProcessingUpdates] = useState([]);

    console.log('UnProcessedData', UnProcessedData);
    console.log('ProcessedData', ProcessedData);

    // Initialize WebSocket connection
    useEffect(() => {
        socket.current = io('http://localhost:5000', {
            transports: ['websocket'] // Force WebSocket transport
        });

        // Listen for server messages
        socket.current.on('message', (data) => {
            setSocketMessages((prev) => [...prev, data.message]);
        });

        // Listen for notifications
        socket.current.on('notification', (data) => {
            setNotification(data.data);
        });

        // Listen for processing updates
        socket.current.on('processing_update', (data) => {
            setProcessingUpdates((prev) => [
                ...prev,
                `Step ${data.step}: ${data.status}`
            ]);
        });

        // Cleanup on component unmount
        return () => {
            socket.current.disconnect();
        };
    }, []);

    // Fetch data from backend API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseUnProcessed = await axios.get(
                    'http://localhost:4000/test/getJSON'
                );
                setUnProcessedData(responseUnProcessed.data);

                const responseProcessed = await axios.get(
                    'http://localhost:4000/test/getProcessedJSON'
                );
                setProcessedData(responseProcessed.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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

    // WebSocket actions
    const sendNotification = () => {
        socket.current.emit(
            'send_notification',
            'This is a test notification!'
        );
    };

    const startProcessing = () => {
        socket.current.emit('start_processing');
    };

    return (
        <div>
            <h1>Data Table</h1>

            {/* WebSocket Controls */}
            <div>
                <h2>WebSocket Test</h2>
                <div className='flex space-x-4 flex-row items-center justify-center'>
                    <button
                        className='border-2 border-black'
                        onClick={sendNotification}
                    >
                        Send Notification
                    </button>
                    <button
                        className='border-2 border-black'
                        onClick={startProcessing}
                    >
                        Start Processing
                    </button>
                </div>
            </div>

            <div>
                <h3>Socket Messages:</h3>
                <ul>
                    {socketMessages.map((msg, idx) => (
                        <li key={idx}>{msg}</li>
                    ))}
                </ul>
                <h3>Latest Notification:</h3>
                <p>{notification || 'No notifications yet'}</p>
                <h3>Processing Updates:</h3>
                <ul>
                    {processingUpdates.map((update, idx) => (
                        <li key={idx}>{update}</li>
                    ))}
                </ul>
            </div>

            {/* File Upload Section */}
            <div>
                <h2>Upload CSV File</h2>
                <input type='file' accept='.csv' onChange={handleFileChange} />
                <button onClick={handleFileUpload}>Upload</button>
            </div>

            <div className='flex h-96'>
                <h2>Violation Summary</h2>
                <Pie data={pieData} />
                <Counter from={0} to={totalViolations} duration={1} />
            </div>

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

                {/* <div className='text-4xl'>Processed Data</div>
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
                </table> */}
            </div>
        </div>
    );
};

export default JSONTable;
