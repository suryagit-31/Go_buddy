import React from "react";
import { motion } from "framer-motion";
import { UserRound } from "lucide-react";

const CompanionCard = ({ name, age, location, languages, onRequestTravel }) => {
  return (
    <motion.div
      className="border border-neutral-200 rounded-lg shadow-soft bg-white overflow-hidden"
      whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-4 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
              <UserRound className="h-6 w-6 text-primary-600" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold text-neutral-900">{name}</h3>
              <p className="text-sm text-neutral-600">{location}</p>
            </div>

            <p className="mt-1 text-sm text-neutral-600">{age} years old</p>

            <div className="mt-2 flex flex-wrap gap-1">
              {languages.map((lang) => (
                <span
                  key={lang}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800"
                >
                  {lang}
                </span>
              ))}
            </div>

            <motion.button
              onClick={onRequestTravel}
              className="mt-4 w-full px-4 py-2 bg-primary-50 text-primary-700 text-sm font-medium rounded-md hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Request to Travel Together
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CompanionCard;
