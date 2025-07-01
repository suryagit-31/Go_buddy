import { create } from "zustand";
import axiosInstance from "../utils/axios";

const useFlightStore = create((set) => ({
  available_flights: [],
  isloadingflights: false,
  join_flight: null,
  is_joiningflight: false,

  fetchFlights: async (data) => {
    try {
      set({ isloadingflights: true });
      const response = await axiosInstance.post("/flights", data);
      //  console.log("response", response);
      set({ available_flights: [...response.data], isloadingflights: false });
    } catch (error) {
      console.log("Error fetching flights in your input :", error);
      if (error.response && error.response.status == 500) {
        console.log("No flight data found for the given route and date.");
      } else {
        console.log("something went wrong");
      }
    }
  },

  clearFlights: () => set({ available_flights: [] }),

  get_joinflight: async (iata, date) => {
    try {
      set({ is_joiningflight: true });
      //console.log("✈️ Calling flightjoin with:", iata, date);
      const response = await axiosInstance.get(
        `/flights/flightjoin/${iata}/${date}`
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
      console.log(formData);
      const response = await axiosInstance.post("/companions", formData);
      console.log("✅ Companion saved to DB:", response);
      return response.data;
    } catch (error) {
      console.error("❌ Error saving to DB:", error);
    }
  },
}));

export default useFlightStore;
