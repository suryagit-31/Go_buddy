import React, { useState } from "react";
import PageTransition from "../components/pagetransition";
import FlightSearchForm from "../components/flightsearchform";
import FlightCard from "../components/flightcard";
import CompanionCard from "../components/CompanionCard";
import { motion } from "framer-motion";

// Mock data
const mockFlights = [
  {
    id: "1",
    flightNumber: "DL 114",
    from: "New York",
    to: "Paris",
    date: "May 20, 2025",
  },
  {
    id: "2",
    flightNumber: "AF 257",
    from: "New York",
    to: "Paris",
    date: "May 21, 2025",
  },
  {
    id: "3",
    flightNumber: "UA 789",
    from: "New York",
    to: "Paris",
    date: "May 22, 2025",
  },
];

const mockCompanions = [
  {
    id: "1",
    name: "Annette Black",
    age: 68,
    location: "New York",
    languages: ["English", "French"],
  },
  {
    id: "2",
    name: "Robert Johnson",
    age: 72,
    location: "New York",
    languages: ["English"],
  },
  {
    id: "3",
    name: "Maria Garcia",
    age: 65,
    location: "New York",
    languages: ["English", "Spanish"],
  },
];

const FlightSearchPage = () => {
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [requestSent, setRequestSent] = useState(false);

  const handleJoinFlight = (flightId) => {
    setSelectedFlight(flightId);
  };

  const handleRequestTravel = () => {
    setRequestSent(true);
    setTimeout(() => {
      setRequestSent(false);
    }, 3000);
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockFlights.map((flight) => (
                <FlightCard
                  key={flight.id}
                  flightNumber={flight.flightNumber}
                  from={flight.from}
                  to={flight.to}
                  date={flight.date}
                  onJoin={() => handleJoinFlight(flight.id)}
                />
              ))}
            </div>
          </div>

          {selectedFlight && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                Matching Companions
              </h2>

              {requestSent ? (
                <div className="bg-success-50 border border-success-200 text-success-800 px-4 py-3 rounded-md">
                  <p>
                    Travel request sent successfully! The companion will be
                    notified.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockCompanions.map((companion) => (
                    <CompanionCard
                      key={companion.id}
                      name={companion.name}
                      age={companion.age}
                      location={companion.location}
                      languages={companion.languages}
                      onRequestTravel={handleRequestTravel}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default FlightSearchPage;
