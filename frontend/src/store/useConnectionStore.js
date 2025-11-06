import { create } from "zustand";
import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";

const useConnectionStore = create((set, get) => ({
  connections: [],
  pendingRequests: [],
  isLoading: false,
  connectionStatuses: {}, // Cache for connection statuses

  // Request a connection with a companion
  requestConnection: async (data) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.post("/connections/request", data);
      toast.success("Connection request sent!");
      // Refresh connections
      await get().getUserConnections();
      await get().getPendingRequests();
      return response.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send connection request"
      );
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Accept a connection request
  acceptConnection: async (connectionId) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.put(
        `/connections/${connectionId}/accept`
      );
      toast.success("Connection accepted!");
      // Refresh connections
      await get().getUserConnections();
      await get().getPendingRequests();
      return response.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to accept connection"
      );
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Reject a connection request
  rejectConnection: async (connectionId) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.put(
        `/connections/${connectionId}/reject`
      );
      toast.success("Connection request rejected");
      // Refresh connections
      await get().getUserConnections();
      await get().getPendingRequests();
      return response.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to reject connection"
      );
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Cancel a connection
  cancelConnection: async (connectionId) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.put(
        `/connections/${connectionId}/cancel`
      );
      toast.success("Connection cancelled");
      await get().getUserConnections();
      return response.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to cancel connection"
      );
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Mark connection as completed
  completeConnection: async (connectionId) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.put(
        `/connections/${connectionId}/complete`
      );
      toast.success("Connection marked as completed!");
      await get().getUserConnections();
      return response.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to complete connection"
      );
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Get all connections for current user
  getUserConnections: async (status = null) => {
    try {
      set({ isLoading: true });
      const url = status ? `/connections?status=${status}` : "/connections";
      const response = await axiosInstance.get(url);
      set({ connections: response.data });
      return response.data;
    } catch (error) {
      console.error("Error fetching connections:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch connections"
      );
      return [];
    } finally {
      set({ isLoading: false });
    }
  },

  // Get pending connection requests
  getPendingRequests: async () => {
    try {
      const response = await axiosInstance.get("/connections/pending");
      set({ pendingRequests: response.data });
      return response.data;
    } catch (error) {
      console.error("Error fetching pending requests:", error);
      return [];
    }
  },

  // Get connection status for a specific companion
  getConnectionStatus: async (
    companionType,
    companionRequestId,
    flight_iata,
    flight_date
  ) => {
    try {
      const cacheKey = `${companionType}-${companionRequestId}-${flight_iata}-${flight_date}`;

      // Check cache first
      if (get().connectionStatuses[cacheKey]) {
        return get().connectionStatuses[cacheKey];
      }

      const response = await axiosInstance.get(
        `/connections/status/${companionType}/${companionRequestId}/${flight_iata}/${flight_date}`
      );

      // Cache the result
      set((state) => ({
        connectionStatuses: {
          ...state.connectionStatuses,
          [cacheKey]: response.data,
        },
      }));

      return response.data;
    } catch (error) {
      console.error("Error fetching connection status:", error);
      return { status: "none", connection: null };
    }
  },

  // Clear connection status cache
  clearConnectionStatusCache: () => {
    set({ connectionStatuses: {} });
  },
}));

export default useConnectionStore;
