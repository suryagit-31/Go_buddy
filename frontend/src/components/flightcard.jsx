import React from "react";
import { motion } from "framer-motion";
import { Plane } from "lucide-react";

const FlightCard = ({ flightNumber, airline, from, to, date, onJoin }) => {
  return (
    <motion.div
      className="border border-neutral-200 rounded-lg shadow-soft bg-white overflow-hidden"
      whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900">
            {flightNumber} - {airline}
          </h3>
          <motion.button
            onClick={onJoin}
            className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Join
          </motion.button>
        </div>

        <div className="mt-4 flex items-center">
          <div className="min-w-0 flex-1">
            <p className="text-base text-neutral-900 truncate font-semibold">{from}</p>
          </div>

          <div className="mx-2 flex-shrink-0 text-neutral-400">
            <Plane className="h-5 w-5 text-blue-600" />
          </div>

          <div className="min-w-0 flex-1 text-right">
            <p className="text-base text-neutral-900 font-semibold truncate">{to}</p>
          </div>
        </div>

        <div className="mt-2">
          <p className="text-md text-neutral-800">{date}
</p>
        </div>
      </div>
    </motion.div>
  );
};

export default FlightCard;
