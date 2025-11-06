import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plane,
  User,
  Phone,
  Globe2,
  Languages,
  DollarSign,
  Mail,
  MapPin,
} from "lucide-react";
import PageTransition from "../components/pagetransition";
import { useAuth } from "../context/authcontext";
import Flightcompanioncard from "../components/flightcompanioncard";
import useFlightStore from "../store/useflightstore";
import Helpfrom from "../components/helpfrom";

const FlightJoinpage = () => {
  const { iata, date } = useParams();
  const [flightData, setFlightData] = useState([]);
  const { join_flight, get_joinflight, get_OtherCompanions } = useFlightStore();

  useEffect(() => {
    if (!iata || !date) return;
    const fetchData = async () => {
      await get_joinflight(iata, date);
    };
    fetchData();
    get_OtherCompanions(iata, date);
  }, [iata, date]);

  useEffect(() => {
    if (join_flight) {
      setFlightData(join_flight); // Set the flight data once `join_flight` has been updated
    }
  }, [join_flight]);

  const flight_duration = () => {
    const depTime = new Date(flightData[0]?.departure?.scheduled);
    const arrTime = new Date(flightData[0]?.arrival?.scheduled);

    const durationMs = arrTime - depTime;
    const durationMinutes = Math.floor(durationMs / (1000 * 60));
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    const flightDuration = `${hours}h ${minutes}m`;

    if (flightDuration === "NANh NaNm") {
      return "N/A";
    }

    return flightDuration;
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Flight Details & Companions
            </h1>
            <p className="text-neutral-600">
              View flight information and connect with travel companions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Flight Details Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-neutral-100">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                      <Plane className="h-6 w-6 text-primary-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-900">
                      Flight Details
                    </h2>
                  </div>
                </div>

                {flightData.length > 0 ? (
                  <dl className="grid grid-cols-1 gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="p-4 bg-primary-50 rounded-lg"
                    >
                      <dt className="text-sm font-medium text-primary-700 mb-1">
                        Airline
                      </dt>
                      <dd className="text-2xl font-bold text-primary-600">
                        {flightData[0]?.airline?.name || "IATA not found"}
                      </dd>
                      <dd className="mt-2 text-base text-neutral-700">
                        {flightData[0]?.airline?.iata &&
                        flightData[0]?.flight?.number
                          ? `${flightData[0].airline.iata} ${flightData[0].flight.number} • ${flightData[0].flight_date}`
                          : "Flight Number"}
                      </dd>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-4">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-4 bg-neutral-50 rounded-lg"
                      >
                        <dt className="text-sm font-medium text-neutral-500 mb-1">
                          From
                        </dt>
                        <dd className="text-lg font-semibold text-neutral-900">
                          {flightData[0]?.departure?.airport} (
                          {flightData[0]?.departure?.iata})
                        </dd>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-4 bg-neutral-50 rounded-lg"
                      >
                        <dt className="text-sm font-medium text-neutral-500 mb-1">
                          To
                        </dt>
                        <dd className="text-lg font-semibold text-neutral-900">
                          {flightData[0]?.arrival?.airport} (
                          {flightData[0]?.arrival?.iata})
                        </dd>
                      </motion.div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <dt className="text-sm font-medium text-neutral-700">
                          Scheduled-Departure
                        </dt>
                        <dd className="mt-1 text-lg text-neutral-900">
                          {flightData[0]?.departure?.scheduled &&
                          flightData[0]?.departure?.timezone
                            ? new Intl.DateTimeFormat("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                timeZone: flightData[0]?.departure?.timezone,
                                timeZoneName: "short",
                                hour12: false,
                              }).format(
                                new Date(flightData[0]?.departure?.scheduled)
                              )
                            : "Time not available"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-neutral-700">
                          Scheduled-Arrival
                        </dt>
                        <dd className="mt-1 text-lg text-neutral-900">
                          {flightData[0]?.arrival?.scheduled &&
                          flightData[0]?.arrival?.timezone
                            ? new Intl.DateTimeFormat("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                timeZone: flightData[0]?.arrival?.timezone,
                                timeZoneName: "short",
                                hour12: false,
                              }).format(
                                new Date(flightData[0]?.arrival?.scheduled)
                              )
                            : "Time not available"}
                        </dd>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <dt className="text-sm font-medium text-neutral-700">
                          DEP-Terminal
                        </dt>
                        <dd className="mt-1 text-lg text-neutral-900">
                          {flightData[0]?.departure?.terminal ||
                            " Terminal not found"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-neutral-700">
                          DEP-Gate
                        </dt>
                        <dd className="mt-1 text-lg text-neutral-900">
                          {flightData[0]?.departure?.gate ||
                            " dep-Gate not found"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-neutral-700">
                          Journey duration
                        </dt>
                        <dd className="mt-1 text-lg text-neutral-900">
                          {flight_duration()}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-sm font-medium text-neutral-700">
                          Flight Status
                        </dt>
                        <dd className="mt-1 text-lg text-neutral-900">
                          {flightData[0]?.flight_status || "status unavailable"}
                        </dd>
                      </div>
                    </div>
                  </dl>
                ) : (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    <span className="ml-3 text-neutral-600">
                      Loading flight details...
                    </span>
                  </div>
                )}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6"
                >
                  <Helpfrom
                    flight_Date={flightData[0]?.flight_date}
                    flight_iata={flightData[0]?.flight.iata}
                  />
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Flightcompanioncard
                flight_iata={flightData[0]?.flight?.iata}
                flight_date={flightData[0]?.flight_date}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default FlightJoinpage;
