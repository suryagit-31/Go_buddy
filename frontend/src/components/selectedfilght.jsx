import React from "react";
import { Plane } from "lucide-react";

const Selected_FlightDetails = ({
  flightData,
  showJoinForm,
  setShowJoinForm,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-soft p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-neutral-900">Flight Details</h2>
        <Plane className="h-6 w-6 text-primary-600" />
      </div>

      <dl className="grid grid-cols-1 gap-4">
        <div>
          <dt className="text-sm font-medium text-neutral-500">
            {flightData?.flight?.iata || "IATA not found"}
          </dt>
          <dd className="mt-1 text-lg text-neutral-900">
            {flightData.flightNumber || "Flight Number"}
          </dd>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-neutral-500">From</dt>
            <dd className="mt-1 text-lg text-neutral-900">
              {flightDetails.from}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-neutral-500">To</dt>
            <dd className="mt-1 text-lg text-neutral-900">
              {flightDetails.to}
            </dd>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-neutral-500">Departure</dt>
            <dd className="mt-1 text-lg text-neutral-900">
              {flightDetails.departureTime}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-neutral-500">Arrival</dt>
            <dd className="mt-1 text-lg text-neutral-900">
              {flightDetails.arrivalTime}
            </dd>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-neutral-500">Terminal</dt>
            <dd className="mt-1 text-lg text-neutral-900">
              {flightDetails.terminal}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-neutral-500">Gate</dt>
            <dd className="mt-1 text-lg text-neutral-900">
              {flightDetails.gate}
            </dd>
          </div>
        </div>
      </dl>

      {!showJoinForm && (
        <motion.button
          onClick={() => setShowJoinForm(true)}
          className="mt-6 w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Join This Flight
        </motion.button>
      )}
    </div>
  );
};

export default Selected_FlightDetails;
