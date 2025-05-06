import { create } from "zustand";
import axiosInstance from "../utils/axios";

const useFlightStore = create((set) => ({
  available_flights: [],
  isloadingflights: false,
  join_flight: [],
  is_joiningflight: false,

  fetchFlights: async (data) => {
    try {
      set({ isloadingflights: true });
      const response = await axiosInstance.post("/flights", data);
      console.log("response", response);
      set({ available_flights: [...response.data], isloadingflights: false });
    } catch (error) {
      console.log("Error fetching flights in your input :", error);
      if (error.response && error.response.status == 500) {
        alert("No flight data found for the given route and date.");
      } else {
        alert("something went wrong");
      }
    }
  },

  clearFlights: () => set({ available_flights: [] }),

  get_joinflight: async (iata, date) => {
    try {
      set({ is_joiningflight: true });
      const response = await axiosInstance.get(`/flights/${iata}/${date}`);
      console.log("response", response);
      set({ join_flight: [...response.data] });
      set({ is_joiningflight: false });
    } catch (error) {
      console.log(" error to join the flight:", error);
      if (error.response && error.response.status == 500) {
        alert("No flight data found for the given route and date.");
      } else {
        alert("something went wrong");
      }
    }
  },
}));

export default useFlightStore;
