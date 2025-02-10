// Sends a message to the server
export const handleMessageEvent = (socket, message) => {
    if (!socket) {
        console.error("Socket is not connected.");
        return;
    }
    socket.emit("send_message", message);
    console.log("Message sent:", message);
};

// Sets up a listener for messages from the server
export const setupMessageListener = (socket, setResponse) => {
    if (!socket) {
        console.error("Socket is not connected.");
        return;
    }

    socket.off("receive_message"); // ✅ Prevent duplicate listeners

    socket.on("receive_message", (msg) => {
        console.log("Received from server:", msg);
        setResponse(msg);
    });
};

// Handles connection and disconnection events
export const handleConnectionEvent = (socket) => {
    if (!socket) {
        console.error("Socket is not connected.");
        return;
    }

    socket.on("connect", () => {
        console.log("Connected to the server");
    });

    socket.on("disconnect", () => {
        console.log("Disconnected from the server");
    });

    socket.on("connect_error", (err) => {
        console.error("Connection error:", err);
    });
};
