import { create } from "zustand";
import axiosInstance from "../utils/axios";
import { getSocket } from "../utils/socket";
import toast from "react-hot-toast";

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  // Fetch notifications
  fetchNotifications: async (unreadOnly = false) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.get("/notifications", {
        params: { unreadOnly, limit: 50 },
      });
      set({
        notifications: response.data.notifications,
        unreadCount: response.data.unreadCount,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  // Fetch unread count
  fetchUnreadCount: async () => {
    try {
      const response = await axiosInstance.get("/notifications/unread/count");
      set({ unreadCount: response.data.unreadCount });
      return response.data.unreadCount;
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      await axiosInstance.put(`/notifications/${notificationId}/read`);
      set((state) => ({
        notifications: state.notifications.map((notif) =>
          notif._id === notificationId
            ? { ...notif, read: true, readAt: new Date() }
            : notif
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  },

  // Mark all as read
  markAllAsRead: async () => {
    try {
      await axiosInstance.put("/notifications/read/all");
      set((state) => ({
        notifications: state.notifications.map((notif) => ({
          ...notif,
          read: true,
          readAt: new Date(),
        })),
        unreadCount: 0,
      }));
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    try {
      await axiosInstance.delete(`/notifications/${notificationId}`);
      set((state) => ({
        notifications: state.notifications.filter(
          (notif) => notif._id !== notificationId
        ),
        unreadCount: state.notifications.find(
          (notif) => notif._id === notificationId && !notif.read
        )
          ? Math.max(0, state.unreadCount - 1)
          : state.unreadCount,
      }));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  },

  // Add notification (from socket)
  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));

    // Show toast notification
    const getNotificationIcon = (type) => {
      switch (type) {
        case "message":
          return "💬";
        case "reminder":
          return "✈️";
        case "connection":
          return "🤝";
        default:
          return "🔔";
      }
    };

    toast(notification.message, {
      icon: getNotificationIcon(notification.type),
      duration: 5000,
    });
  },

  // Initialize socket listeners
  initializeSocketListeners: () => {
    const socket = getSocket();
    if (!socket) return;

    socket.on("notification", (notification) => {
      get().addNotification(notification);
    });

    socket.on("new_message", (message) => {
      // This is handled by messageStore, but we can also add a notification
      if (message.receiverId?._id) {
        get().addNotification({
          type: "message",
          title: "New Message",
          message: `New message from ${message.senderId?.name || "Someone"}`,
          connectionId: message.connectionId,
          messageId: message._id,
          timestamp: new Date(),
        });
      }
    });
  },
}));

export default useNotificationStore;
