import React, { useState, useEffect } from "react";
import PageTransition from "../components/pagetransition";
import FlightSearchForm from "../components/flightsearchform";
import FlightCard from "../components/flightcard";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/authcontext";
import { useNavigate } from "react-router-dom";
import useFlightStore from "../store/useflightstore";
import { Plane, Search, Loader, Sparkles } from "lucide-react";

const FlightSearchPage = () => {
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [requestSent, setRequestSent] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { available_flights, isloadingflights, get_joinflight } =
    useFlightStore();

  const handleJoinFlight = async (iata, date) => {
<<<<<<< HEAD
=======
   // if (!isAuthenticated) {
  //  navigate("/login");
    //  return;
    //}
    // Encode the date to make it URL-safe (important!)
>>>>>>> 30b81bf8857f2dc693297013e31a48c449b043af
    const encodedDate = encodeURIComponent(date);
    navigate(`/flightjoin/${iata}/${encodedDate}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
              <Plane className="h-8 w-8 text-primary-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-3">
              Find Your Flight Companion
            </h1>
            <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto">
              Search for flights and connect with fellow travelers who share
              your journey
            </p>
          </motion.div>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <FlightSearchForm compact />
          </motion.div>

          {/* Flights Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-neutral-900 flex items-center gap-2">
                <Search className="h-6 w-6 text-primary-600" />
                Available Flights
              </h2>
              {available_flights.length > 0 && (
                <span className="px-4 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                  {available_flights.length}{" "}
                  {available_flights.length === 1 ? "flight" : "flights"} found
                </span>
              )}
            </div>

            {isloadingflights ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <Loader className="h-12 w-12 animate-spin text-primary-600 mb-4" />
                <p className="text-lg text-neutral-600">
                  Searching for flights...
                </p>
              </motion.div>
            ) : !available_flights || available_flights.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 bg-white rounded-2xl shadow-soft"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neutral-100 mb-4">
                  <Plane className="h-10 w-10 text-neutral-400" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  No flights found
                </h3>
                <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                  We couldn't find any flights matching your search criteria.
                  Try adjusting your dates or route.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  Modify Search
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {available_flights
                  .filter((flight) => {
                    // Try multiple possible structures
                    const hasFlightIata =
                      flight?.flight?.iata ||
                      flight?.iata ||
                      flight?.flight_iata ||
                      flight?.flightNumber;

                    return isValid;
                  })
                  .map((flight, index) => {
                    // Handle different data structures
                    const flightIata =
                      flight.flight?.iata ||
                      flight.iata ||
                      flight.flight_iata ||
                      flight.flightNumber ||
                      "N/A";
                    const flightDate =
                      flight.flight_date || flight.date || flight.flightDate;
                    const flightKey = `${flightIata}-${flightDate || index}`;

                    return (
                      <motion.div
                        key={flightKey}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        className="h-full"
                      >
                        <FlightCard
                          flightNumber={flightIata}
                          airline={
                            flight.airline?.name || flight.airline || "N/A"
                          }
                          from={
                            flight.departure?.iata ||
                            flight.departure?.airport ||
                            flight.from ||
                            "N/A"
                          }
                          to={
                            flight.arrival?.iata ||
                            flight.arrival?.airport ||
                            flight.to ||
                            "N/A"
                          }
                          date={
                            flightDate
                              ? new Date(flightDate).toDateString()
                              : "N/A"
                          }
                          onJoin={() =>
                            handleJoinFlight(flightIata, flightDate)
                          }
                        />
                      </motion.div>
                    );
                  })}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default FlightSearchPage;
