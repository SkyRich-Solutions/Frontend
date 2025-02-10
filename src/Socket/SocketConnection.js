import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { handleConnectionEvent } from "./SocketHandler";

const socket = io("http://localhost:4000", {
    transports: ["websocket"], // Ensures WebSocket connection
    reconnection: true, // Enables automatic reconnection
});

const useSocket = () => {
    useEffect(() => {
        handleConnectionEvent(socket);
        return () => {
            socket.disconnect();
        };
    }, []);

    return socket;
};

export default socket; // ✅ Correctly exporting the socket instance
