import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { handleConnectionEvent } from './SocketHandler';

const SocketConnection = () => {
    const [socket, setSocket] = useState(null);

    // Establish socket connection on mount
    useEffect(() => {
        const socketInstance = io('http://localhost:4000'); // Replace with your server URL
        setSocket(socketInstance);

        // Handle connection and disconnection
        handleConnectionEvent(socketInstance);

        // Cleanup socket connection on unmount
        return () => {
            socketInstance.disconnect();
        };
    }, []);

    // Return socket instance to other parts of the app that need it
    return socket;
};

export default SocketConnection;