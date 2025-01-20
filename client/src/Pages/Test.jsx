import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';
import Counter from '../Components/Counter';

const JSONTable = () => {
    const [data, setData] = useState([]);

    console.log('Data : ', data);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState(null);

    // Fetch data from backend API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    'http://localhost:4000/test/getJSON'
                ); // Replace with your actual backend URL
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const jsonData = await response.json();
                setData(jsonData);
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

    // Upload CSV fil

    // Parse CSV file with PapaParse
    const handleFileUpload = () => {
        if (!file) {
            alert('Please select a CSV file first');
            return;
        }

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            strict: false,
            complete: async (results) => {
                console.log('Parsed CSV data:', results.data);

                // Normalize headers and map to Mongoose schema structure
                const normalizedData = results.data.map((row) => {
                    const normalizedRow = {};

                    // Rename keys to match Mongoose schema format
                    Object.keys(row).forEach((key) => {
                        const normalizedKey = key
                            .trim()
                            .replace(/\s+/g, '_') // Replace spaces with underscores
                            .replace(/\-/g, '_')
                            .replace(/\(.*\)/, '') // Remove parentheses and content (e.g., Batch_Management(Plant))
                            .replace(
                                /^Batch_Management$/,
                                'Batch_ManagementPlant'
                            ) // Handle specific renaming like Batch_Management -> Batch_ManagementPlant
                            .replace('Serial_No._Profile', 'Serial_No_Profile'); // Handle serial no renaming

                        // Assign value to normalized key
                        normalizedRow[normalizedKey] = row[key] || ''; // Set default empty string if value is missing
                    });

                    return normalizedRow;
                });

                console.log('Normalized Data:', normalizedData);

                try {
                    // Send validated data to the backend
                    const response = await axios.post(
                        'http://localhost:4000/test/postJSON',
                        normalizedData
                    );
                    alert('File uploaded successfully!');
                    console.log('Backend response:', response.data);

                    // Optionally refresh the table data
                    setData((prevData) => [...prevData, ...normalizedData]);
                } catch (err) {
                    console.error(
                        'Error uploading data:',
                        err.response?.data || err.message
                    );
                    alert(
                        'Failed to upload file. Check the console for details.'
                    );
                }
            },
            error: (err) => {
                console.error('Error parsing CSV:', err);
                alert(
                    'Error parsing CSV file. Ensure it is formatted correctly.'
                );
            }
        });
    };

    if (loading) {
        return <p> Loading data...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    // if (!data || data.length === 0) {
    //     return <p>No data available</p>;
    // }

    return (
        <div>
            <h1>Data Table</h1>

            {/* File Upload Section */}
            <div>
                <h2>Upload CSV File</h2>
                <input type='file' accept='.csv' onChange={handleFileChange} />
                <button onClick={handleFileUpload}>Upload</button>
                {/* <Upload /> */}
            </div>

            <br />

            <div className='text-2xl'>
                <span className='text-2xl'>Violation : </span>
                <Counter
                    from={0}
                    to={1000}
                    separator=','
                    direction='up'
                    duration={1}
                    className='count-up-text'
                />
            </div>
            <br />
            <div className=''>
                <table className='border-spacing-2 border-2 border-black'>
                    <thead>
                        <tr>
                            {Object.keys(data[0]).map((key) => (
                                <th key={key}>{key}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.slice(0, 10).map((row, rowIndex) => (
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
