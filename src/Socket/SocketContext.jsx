import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { handleConnectionEvent } from './SocketHandler';

// Create the context
const SocketContext = createContext(null);

// Create a provider component
export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socketInstance = io('http://localhost:4000'); // Replace with your server URL
        setSocket(socketInstance);

        handleConnectionEvent(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

// Custom hook to use the socket
export const useSocket = () => {
    return useContext(SocketContext);
};
