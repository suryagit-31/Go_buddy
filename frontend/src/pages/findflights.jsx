import React, { useState } from "react";
import PageTransition from "../components/pagetransition";
import FlightSearchForm from "../components/flightsearchform";
import FlightCard from "../components/flightcard";
import { motion } from "framer-motion";
import { useAuth } from "../context/authcontext";
import { useNavigate } from "react-router-dom";
import useFlightStore from "../store/useflightstore";
import FlightJoinpage from "./flightjoinpage";

const FlightSearchPage = () => {
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [requestSent, setRequestSent] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { available_flights, isloadingflights, get_joinflight } =
    useFlightStore();

  const handleJoinFlight = async (iata, date) => {
   // if (!isAuthenticated) {
  //  navigate("/login");
    //  return;
    //}
    // Encode the date to make it URL-safe (important!)
    const encodedDate = encodeURIComponent(date);
    navigate(`/flightjoin/${iata}/${encodedDate}`);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-neutral-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-900">
              Find Your Flight Companion
            </h1>
            <p className="mt-2 text-lg text-neutral-600">
              Search for flights and connect with fellow travelers
            </p>
          </div>

          <div className="mb-8">
            <FlightSearchForm compact />
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Available Flights
            </h2>
            {available_flights.length === 0 && !isloadingflights ? (
              <p className="text-neutral-600">
                No flights available for the selected route and date.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {available_flights.map((flight, index) => (
                  <FlightCard
                    key={`${flight.flight.iata + flight.flight_date}`}
                    flightNumber={flight.flight?.iata || "N/A"}
                    airline={flight.airline?.name || "N/A"}
                    from={flight.departure?.iata || flight.departure?.airport}
                    to={flight.arrival?.iata || flight.arrival?.airport}
                    date={new Date(flight.flight_date).toDateString()}
        
                    onJoin={() =>
                      handleJoinFlight(flight.flight.iata, flight.flight_date)
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default FlightSearchPage;
