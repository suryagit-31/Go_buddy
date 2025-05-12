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
  const { join_flight, get_joinflight, is_joiningflight } = useFlightStore();

  useEffect(() => {
    const fetchData = async () => {
      await get_joinflight(iata, date);
    };
    fetchData();
  }, [iata, date]);

  useEffect(() => {
    if (join_flight) {
      setFlightData(join_flight); // Set the flight data once `join_flight` has been updated
      console.log("Flight data:", join_flight); // Log the updated data
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
      {
        <div className="min-h-screen bg-neutral-50 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Flight Details Section */}
              <div>
                <div className="bg-white rounded-lg shadow-soft p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-neutral-900">
                      Flight Details
                    </h2>
                    <Plane className="h-6 w-6 text-primary-600" />
                  </div>

                  {flightData.length > 0 ? (
                    <dl className="grid grid-cols-1 gap-4">
                      <div>
                        <dt className="text-xl font-bold text-primary-600">
                          {flightData[0]?.airline?.name || "IATA not found"}
                        </dt>
                        <dd className="mt-1 text-lg text-neutral-900">
                          {flightData[0]?.airline?.iata &&
                          flightData[0]?.flight?.number
                            ? `${flightData[0].airline.iata} ${flightData[0].flight.number}   (${flightData[0].flight_date})`
                            : "Flight Number"}
                        </dd>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <dt className="text-sm font-medium text-neutral-700">
                            From
                          </dt>
                          <dd className="mt-1 text-lg text-neutral-900">
                            {flightData[0]?.departure?.airport}(
                            {flightData[0]?.departure?.iata})
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-neutral-700">
                            To
                          </dt>
                          <dd className="mt-1 text-lg text-neutral-900">
                            {flightData[0]?.arrival?.airport}(
                            {flightData[0]?.arrival?.iata})
                          </dd>
                        </div>
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
                            {flightData[0]?.flight_status ||
                              "status unavailable"}
                          </dd>
                        </div>
                      </div>
                    </dl>
                  ) : (
                    <p>Loading flight details...</p>
                  )}
                  <Helpfrom flight_Date={flightData[0]?.flight_date} flight_iata={flightData[0]?.flight.iata} />
                </div>
              </div>
              <Flightcompanioncard />
            </div>
          </div>
        </div>
      }
      {/* No need to change your actual JSX content unless it has TS-specific syntax */}
    </PageTransition>
  );
};

export default FlightJoinpage;
