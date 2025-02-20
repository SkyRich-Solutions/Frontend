import React from 'react';
import { useState , useEffect } from 'react';
import axios from 'axios';

import Header from '../Components/Header';
const UploadPage= () =>{
    const [file, setFile] = useState(null);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [socket, setSocket] = useState(null);



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
            setResponse(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred.');
        }
    };

    const [output, setOutput] = useState('');

  const handleRunScript = async () => {
    try {
      const result = await window.electron.runPythonScript('app'); // Replace with your script name (without `.py`)
      setOutput(result); // You can use the result however you like (e.g., display it on the UI)
    } catch (error) {
      console.error('Error running Python script:', error);
    }
  };
    return (
        <div className="flex-1 overflow-auto z-1 h-auto space-y-4">
            <Header title="File Uploader"/>

<div className="flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-6 py-60">
      <div className="bg-gray-900 p-8 rounded-xl shadow-xl text-center">
        <h1 className="text-white text-2xl font-semibold mb-4">Upload CSV File</h1>
        <form onSubmit={handleUpload} className="flex flex-col items-center">
          <input
            type='file'
            accept='.csv'
            onChange={handleFileChange}
            className="mb-4 p-2 border border-gray-600 bg-gray-700 text-white rounded"
          />
          <button
            type='submit'
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Upload
          </button>
        </form>
        
        {response && (
          <div className="mt-4 text-green-400">
            <h3 className="font-bold">Success:</h3>
            <p>Collection Name: {response.collectionName}</p>
          </div>
        )}

        {error && (
          <div className="mt-4 text-red-400">
            <h3 className="font-bold">Error:</h3>
            <p>{error}</p>
          </div>
        )}
      </div>

      <div className="bg-gray-900 p-8 rounded-xl shadow-xl text-center ml-8">
      <button onClick={handleRunScript}>Run Python Script</button>
      <pre>{output}</pre> {/* Display the output of the script here */}
        </div>
    </div>
            
 </div>
    )
}

export default UploadPage;