import { io } from "socket.io-client";

let socket = null;

export const initializeSocket = () => {
  const token = document.cookie.split("jwt=")[1]?.split(";")[0];

  if (!socket && token) {
    socket = io(import.meta.env.VITE_API_URL || "http://localhost:5000", {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    // Listen for notifications
    socket.on("notification", (notification) => {
      console.log("Received notification:", notification);
      // Dispatch custom event for notification store
      window.dispatchEvent(
        new CustomEvent("socket-notification", { detail: notification })
      );
    });

    // Listen for new messages
    socket.on("new_message", (message) => {
      console.log("New message received:", message);
      window.dispatchEvent(
        new CustomEvent("socket-message", { detail: message })
      );
    });
  }

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    initializeSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Typing indicator helpers
export const startTyping = (connectionId) => {
  const sock = getSocket();
  if (sock) {
    sock.emit("typing_start", { connectionId });
  }
};

export const stopTyping = (connectionId) => {
  const sock = getSocket();
  if (sock) {
    sock.emit("typing_stop", { connectionId });
  }
};

// Join/leave connection rooms
export const joinConnection = (connectionId) => {
  const sock = getSocket();
  if (sock) {
    sock.emit("join_connection", connectionId);
  }
};

export const leaveConnection = (connectionId) => {
  const sock = getSocket();
  if (sock) {
    sock.emit("leave_connection", connectionId);
  }
};
