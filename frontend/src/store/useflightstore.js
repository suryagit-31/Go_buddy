import { create } from "zustand";
import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";

const useFlightStore = create((set, get) => ({
  available_flights: [],
  isloadingflights: false,
  join_flight: null,
  is_joiningflight: false,
  OtherCompanions: [],
  MyBookings: [],

  fetchFlights: async (data) => {
    try {
      set({ isloadingflights: true, available_flights: [] });
      const response = await axiosInstance.post("flights", data);
      console.log("Flight response:", response.data);
      const flights = Array.isArray(response.data) ? response.data : [];
      set({ available_flights: flights, isloadingflights: false });
      if (flights.length === 0) {
        toast.info("No flights found for the selected route and date.");
      }
    } catch (error) {
      console.error("Error fetching flights:", error);
      set({ available_flights: [], isloadingflights: false });
      if (error.response && error.response.status === 500) {
        toast.error("No flight data found for the given route and date.");
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to fetch flights. Please try again."
        );
      }
    }
  },

  clearFlights: () => set({ available_flights: [] }),

  get_joinflight: async (iata, date) => {
    try {
      set({ is_joiningflight: true });
      const response = await axiosInstance.get(
        `flights/flightjoin/${iata}/${date}`
      );
      console.log("response", response.data);
      set({ join_flight: response.data });
      set({ is_joiningflight: false });
    } catch (error) {
      console.log(" error to join the flight:", error);
      if (error.response && error.response.status == 500) {
        console.log("No flight data found for the given route and date.");
      } else {
        console.log("something went wrong");
      }
    }
  },
  joinFlightasCompanion: async (formData) => {
    try {
      const response = await axiosInstance.post("/companions", formData);
      toast.success("joined as companion in", formData.flight_iata);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  },

  get_OtherCompanions: async (flight_iata, flight_date) => {
    console.log(flight_iata, flight_date);
    try {
      const response = await axiosInstance.get(
        `/companions/by-flight/${flight_iata}/${flight_date}`
      );
      console.log("response", response.data);
      set({ OtherCompanions: response.data });
      console.log("OtherCompanions", get().OtherCompanions);

      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  },

  Get_Mybookings: async (data) => {
    const UserMail = encodeURIComponent(data);
    try {
      const response = await axiosInstance.get(
        `/companions/by-user/${UserMail}`
      );
      console.log("response", response.data);
      set({ MyBookings: Array.isArray(response.data) ? response.data : [] });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error(error.response?.data?.message || error.message);
      set({ MyBookings: [] });
    }
  },
  cancelBooking: async (id) => {
    try {
      await axiosInstance.delete(`/companions/${id}`);
      set({
        MyBookings: get().MyBookings.filter((b) => b._id !== id),
      });
      toast.success("Booking cancelled");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  },
}));

export default useFlightStore;
