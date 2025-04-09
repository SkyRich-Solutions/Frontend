import React, { useState } from 'react';
import axios from 'axios';
import Header from '../Components/Layout/Header';
import {
    CircleAlertIcon,
    CircleCheckBigIcon,
    WandSparklesIcon
} from 'lucide-react';
import DataHandler from '../Utils/DataHandler';
import DiscrepancyCounter from '../Components/DiscrepancyCounter';

const UploadPage = () => {
    const [file, setFile] = useState(null);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [output, setOutput] = useState('');
    const [UnprocessedData, setUnprocessedData] = useState([]);
    const [ProcessedData, setProcessedData] = useState([]);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setResponse(null);
        setError(null);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            alert('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post(
                'http://localhost:4000/api/uploadFile',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            setResponse(res.data.message);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred.');
            setResponse(null);
        }
    };

    const handleRunScript = async () => {
        setIsLoading(true);
        setLoadingProgress(0);

        // Simulate progress bar
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setLoadingProgress(progress);
            if (progress >= 100) clearInterval(interval);
        }, 200);

        try {
            const response = await axios.post(
                'http://localhost:4000/api/run-python',
                {
                    withCredentials: true
                }
            );

            const data = response.data;
            console.log('Data from python : ', data);

            if (data) {
                const unprocessed = await DataHandler().getUnprocessedData();
                setUnprocessedData(unprocessed);

                const processed = await DataHandler().getProcessedData();
                setProcessedData(processed);

                setOutput(data);
            } else if (data.error) {
                console.error('Error running Python script:', data.error);
            }
        } catch (error) {
            console.error('Error making request:', error);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
                setLoadingProgress(100);
            }, 2000);
        }
    };

    return (
        <div className='flex-1 overflow-auto z-1 h-auto space-y-4'>
            <Header title='File Uploader' />

            <div className='items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-6 h-screen '>
                <div className='bg-gray-900 p-8 rounded-xl shadow-xl text-center flex items-center justify-between'>
                    <h1 className='text-white text-2xl font-semibold'>
                        Upload CSV File
                    </h1>
                    <div>
                        <form
                            onSubmit={handleUpload}
                            className='flex gap-2 justify-center'
                        >
                            <input
                                type='file'
                                accept='.csv'
                                onChange={handleFileChange}
                                className='p-2 border border-gray-600 bg-gray-700 text-white rounded'
                            />
                            <button
                                type='submit'
                                className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                            >
                                Upload
                            </button>
                        </form>

                        {response && (
                            <div className='mt-3 text-green-400 flex gap-1 justify-center'>
                                <b>Success</b>
                                <CircleCheckBigIcon />
                            </div>
                        )}

                        {error && (
                            <div className='mt-3 text-red-400 flex gap-1 justify-center'>
                                <b>Error</b>
                                <CircleAlertIcon />
                            </div>
                        )}
                    </div>

                    <div className='bg-gray-500 text-center px-4 py-3 rounded-lg'>
                        <button
                            onClick={handleRunScript}
                            className='flex gap-1'
                        >
                            <WandSparklesIcon />
                            Clean Data
                        </button>
                    </div>
                </div>

                {isLoading && (
                    <div className='w-full bg-gray-700 h-4 rounded-md mt-4'>
                        <div
                            className='bg-blue-600 h-4 rounded-md'
                            style={{
                                width: `${loadingProgress}%`,
                                transition: 'width 0.3s'
                            }}
                        ></div>
                    </div>
                )}

                {!isLoading && (
                    <>
                        <h1 className='text-white text-2xl font-semibold text-center p-2'>
                            {output}
                        </h1>
                        <span>
                            <DiscrepancyCounter />
                        </span>
                        <div className='flex item-center justify-center '>
                            <h2 className='text-xl w-1/2 font-bold text-center mb-2'>
                                Unprocessed Data
                            </h2>

                            <h2 className='text-xl w-1/2 font-bold text-center mb-2'>
                                Processed Data
                            </h2>
                        </div>
                        <div className='flex w-full gap-4 overflow-auto'>
                            <div className='w-1/2 overflow-auto'>
                                <table className='table-auto border-collapse border border-gray-400 w-full'>
                                    <thead>
                                        <tr className='bg-gray-700'>
                                            {UnprocessedData.length > 0 &&
                                                Object.keys(
                                                    UnprocessedData[0]
                                                ).map((key) => (
                                                    <th
                                                        key={key}
                                                        className='border text-white font-bold px-4 py-2 whitespace-nowrap'
                                                    >
                                                        {key.toUpperCase()}
                                                    </th>
                                                ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {UnprocessedData.map((item, index) => (
                                            <tr
                                                key={index}
                                                className='text-center'
                                            >
                                                {Object.values(item).map(
                                                    (value, i) => (
                                                        <td
                                                            key={i}
                                                            className='border border-gray-400 px-4 py-2 whitespace-nowrap'
                                                        >
                                                            {value}
                                                        </td>
                                                    )
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className='w-1/2 overflow-auto'>
                                <table className='table-auto border-collapse border border-gray-400 w-full'>
                                    <thead>
                                        <tr className='bg-gray-700'>
                                            {ProcessedData.length > 0 &&
                                                Object.keys(
                                                    ProcessedData[0]
                                                ).map((key) => (
                                                    <th
                                                        key={key}
                                                        className='border text-white font-bold px-4 py-2 whitespace-nowrap'
                                                    >
                                                        {key.toUpperCase()}
                                                    </th>
                                                ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ProcessedData.map((item, index) => (
                                            <tr
                                                key={index}
                                                className='text-center'
                                            >
                                                {Object.values(item).map(
                                                    (value, i) => (
                                                        <td
                                                            key={i}
                                                            className='border border-gray-400 px-4 py-2 whitespace-nowrap'
                                                        >
                                                            {value}
                                                        </td>
                                                    )
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default UploadPage;
