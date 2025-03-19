import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import Header from '../Components/Header';
import { WandSparklesIcon } from 'lucide-react';

const UploadPage = () => {
    const [file, setFile] = useState(null);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [output, setOutput] = useState('');

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
                {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            );
            setResponse(res.data.message); // Display success message
            setError(null); // Clear any previous errors
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred.'); // Display error message
            setResponse(null); // Clear any previous success messages
        }
    };

    const handleRunScript = async () => {
        try {
            // Send request to the backend to run a predefined script
            const response = await axios.post(
                'http://localhost:4000/api/run-python',
                {
                    withCredentials: true
                }
            );

            // Extracting output from the response
            const data = response.data;

            if (data.output) {
                setOutput(data.output); // Display the script output
            } else if (data.error) {
                console.error('Error running Python script:', data.error);
            }
        } catch (error) {
            console.error('Error making request:', error);
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
                    <div className=''>
                        <form onSubmit={handleUpload} className='flex gap-2'>
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
                            <div className='mt-4 text-green-400'>
                                <h3 className='font-bold'>Success:</h3>
                                <p>{response}</p>
                            </div>
                        )}

                        {error && (
                            <div className='mt-4 text-red-400'>
                                <h3 className='font-bold'>Error:</h3>
                                <p>{error}</p>
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
            </div>
        </div>
    );
};

export default UploadPage;
