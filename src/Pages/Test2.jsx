import React, { useState, useEffect } from 'react';
import axios from 'axios';
import socket from '../Socket/SocketConnection.js';
import { handleMessageEvent } from '../Socket/SocketHandler.js';

const Test2 = () => {
    const [file, setFile] = useState(null);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on('message', (data) => {
            console.log(`[Received at ${data.timestamp}]: ${data.message}`);
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => {
            socket.off('message');
        };
    }, []);

    const sendMessage = () => {
        if (socket && message.trim()) {
            const timestamp = new Date().toLocaleTimeString();
            const messageData = { message, timestamp };

            handleMessageEvent(socket, messageData);
            setMessages((prevMessages) => [...prevMessages, { ...messageData, sender: 'You' }]);
            setMessage('');
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

        try {
            const res = await axios.post(
                'http://localhost:4000/DynamicFileUpload',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            setResponse(res.data);
        } catch (err) {
            setError(err.response?.data?.message);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: 'auto' }}>
            <h1 style={{ textAlign: 'center', color: '#333' }}>Upload CSV File</h1>
            <form onSubmit={handleUpload} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input type='file' accept='.csv' onChange={handleFileChange} />
                <button type='submit' style={{ padding: '10px 15px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
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

            <h1 style={{ textAlign: 'center', marginTop: '30px', color: '#333' }}>Socket.IO Chat</h1>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #ccc',
                borderRadius: '10px',
                padding: '10px',
                height: '300px',
                overflowY: 'auto',
                backgroundColor: '#f9f9f9'
            }}>
                {messages.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#777' }}>No messages yet...</p>
                ) : (
                    messages.map((msg, index) => (
                        <div key={index} style={{
                            backgroundColor: msg.sender === 'You' ? '#007bff' : '#ddd',
                            color: msg.sender === 'You' ? 'white' : 'black',
                            alignSelf: msg.sender === 'You' ? 'flex-end' : 'flex-start',
                            padding: '8px 12px',
                            borderRadius: '15px',
                            marginBottom: '5px',
                            maxWidth: '70%',
                            textAlign: 'left'
                        }}>
                            <small style={{ fontSize: '12px', display: 'block', marginBottom: '2px' }}>
                                {msg.sender || 'Server'} - {msg.timestamp}
                            </small>
                            {msg.message}
                        </div>
                    ))
                )}
            </div>

            <div style={{ display: 'flex', marginTop: '10px' }}>
                <input
                    type='text'
                    placeholder='Enter message...'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{
                        flexGrow: 1,
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '5px'
                    }}
                />
                <button
                    onClick={sendMessage}
                    style={{
                        padding: '10px 15px',
                        marginLeft: '10px',
                        background: '#28a745',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Test2;
