import { create } from "zustand";
import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";

const useFlightStore = create((set, get) => ({
  available_flights: [],
  isloadingflights: false,
  join_flight: null,
  is_joiningflight: false,
  OtherCompanions: [],

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
        `/companions/${flight_iata}/${flight_date}`
      );
      console.log("response", response.data);
      set({ OtherCompanions: response.data });
      console.log("OtherCompanions", get().OtherCompanions);

      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  },
}));

export default useFlightStore;
