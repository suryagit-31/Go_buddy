import { create } from "zustand";
import axiosInstance from "../utils/axios";
import { getSocket, joinConnection, leaveConnection } from "../utils/socket";

const useMessageStore = create((set, get) => ({
  messages: {},
  typingUsers: {},
  unreadCount: 0,

  // Fetch messages for a connection
  fetchMessages: async (connectionId, page = 1) => {
    try {
      const response = await axiosInstance.get(`/messages/${connectionId}`, {
        params: { page, limit: 50 },
      });

      set((state) => ({
        messages: {
          ...state.messages,
          [connectionId]: response.data.messages,
        },
      }));

      // Join socket room
      joinConnection(connectionId);

      return response.data;
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  },

  // Send text message
  sendMessage: async (connectionId, content) => {
    try {
      const response = await axiosInstance.post("/messages", {
        connectionId,
        content,
      });

      const socket = getSocket();
      if (socket) {
        socket.emit("send_message", response.data);
      }

      set((state) => ({
        messages: {
          ...state.messages,
          [connectionId]: [
            ...(state.messages[connectionId] || []),
            response.data,
          ],
        },
      }));

      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  // Upload file/image
  uploadFile: async (connectionId, file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("connectionId", connectionId);

      const response = await axiosInstance.post("/messages/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const socket = getSocket();
      if (socket) {
        socket.emit("send_message", response.data);
      }

      set((state) => ({
        messages: {
          ...state.messages,
          [connectionId]: [
            ...(state.messages[connectionId] || []),
            response.data,
          ],
        },
      }));

      return response.data;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  },

  // Mark messages as read
  markAsRead: async (messageIds, connectionId) => {
    try {
      await axiosInstance.put("/messages/read", { messageIds });

      const socket = getSocket();
      if (socket) {
        socket.emit("mark_read", { messageIds, connectionId });
      }

      set((state) => ({
        messages: {
          ...state.messages,
          [connectionId]: (state.messages[connectionId] || []).map((msg) =>
            messageIds.includes(msg._id)
              ? { ...msg, read: true, readAt: new Date() }
              : msg
          ),
        },
      }));
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  },

  // Search messages
  searchMessages: async (connectionId, query, page = 1) => {
    try {
      const response = await axiosInstance.get(
        `/messages/search/${connectionId}`,
        {
          params: { query, page, limit: 20 },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error searching messages:", error);
      throw error;
    }
  },

  // Get unread count
  fetchUnreadCount: async () => {
    try {
      const response = await axiosInstance.get("/messages/unread/count");
      set({ unreadCount: response.data.unreadCount });
      return response.data.unreadCount;
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  },

  // Set typing user
  setTypingUser: (connectionId, userId, userName, isTyping) => {
    set((state) => ({
      typingUsers: {
        ...state.typingUsers,
        [connectionId]: isTyping ? { userId, userName } : null,
      },
    }));
  },

  // Add message (from socket)
  addMessage: (connectionId, message) => {
    set((state) => {
      const existingMessages = state.messages[connectionId] || [];
      // Check if message already exists to avoid duplicates
      const messageExists = existingMessages.some(
        (msg) => msg._id === message._id
      );

      if (messageExists) {
        return state;
      }

      return {
        messages: {
          ...state.messages,
          [connectionId]: [...existingMessages, message],
        },
      };
    });
  },

  // Initialize socket listeners for messages
  initializeSocketListeners: () => {
    const socket = getSocket();
    if (!socket) return;

    // Listen for new messages
    socket.on("new_message", (message) => {
      const connectionId = message.connectionId || message.connection;
      if (connectionId) {
        get().addMessage(connectionId, message);
      }
    });

    // Listen for typing indicators
    socket.on("user_typing", (data) => {
      get().setTypingUser(
        data.connectionId,
        data.userId,
        data.userName,
        data.isTyping
      );
    });
  },

  // Leave connection
  leaveConnection: (connectionId) => {
    leaveConnection(connectionId);
  },
}));

export default useMessageStore;
