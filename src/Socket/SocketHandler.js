export const handleConnectionEvent = (socket) => {
    socket.on('connect', () => {
        console.log('Connected to the server');
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from the server');
    });
};

// Function to handle incoming messages and emit responses
export const handleMessageEvent = (socket, message, setResponse) => {
    // Send message to server
    socket.emit('message', message);
    console.log('Message sent:', message);

    // Listen for response from server
    socket.on('message', (msg) => {
        console.log('Received from server:', msg);
        setResponse(msg); // Update state with response from server
    });
};
