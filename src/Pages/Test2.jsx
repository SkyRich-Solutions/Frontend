import React, { useState } from 'react';
import axios from 'axios';
import SocketConnection from '../Socket/SocketConnection.js';
import { handleMessageEvent } from '../Socket/SocketHandler.js';

const Test2 = () => {
    const [file, setFile] = useState(null);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    const socket = SocketConnection();
    const [message, setMessage] = useState('');

    const sendMessage = () => {
        if (socket) {
            // Handle sending message and receiving response
            handleMessageEvent(socket, message, setResponse);
        }
    };

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

        console.log('File:', file);

        try {
            const res = await axios.post(
                'http://localhost:4000/DynamicFileUpload',
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            );
            setResponse(res.data);
        } catch (err) {
            setError(err.response?.data?.message);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Upload CSV File</h1>
            <form onSubmit={handleUpload}>
                <input type='file' accept='.csv' onChange={handleFileChange} />
                <button type='submit' style={{ marginLeft: '10px' }}>
                    Upload
                </button>
            </form>

            {response && (
                <div style={{ marginTop: '20px', color: 'green' }}>
                    <h3>Success:</h3>
                    <p>Collection Name: {response.collectionName}</p>
                </div>
            )}

            {error && (
                <div style={{ marginTop: '20px', color: 'red' }}>
                    <h3>Error:</h3>
                    <p>{error}</p>
                </div>
            )}

            <h1>Socket.IO with React (Clean Architecture)</h1>
            <div>
                <input
                    type='text'
                    placeholder='Enter message'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)} // Update message on input change
                />
                <button onClick={sendMessage}>Send Message</button>
            </div>

            <div>
                <h4>Server Response:</h4>
                <p>{response}</p>
            </div>
        </div>
    );
};

export default Test2;
