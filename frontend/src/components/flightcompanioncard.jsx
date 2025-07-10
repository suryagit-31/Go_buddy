import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Languages,
  DollarSign,
  MapPin,
  ShieldAlert,
  NotebookText,
  ShieldUser,
} from "lucide-react";
import useFlightStore from "../store/useflightstore";

const Flightcompanioncard = () => {
  const { OtherCompanions } = useFlightStore();
  const [filter_users, setFilter] = useState("all");

  const getStatusColor = (status) => {
    return status === "booked"
      ? "bg-blue-100 text-blue-800"
      : "bg-green-100 text-green-800";
  };

  const filteredCompanions =
    OtherCompanions?.filter((companion) => {
      if (filter_users === "all") return true;
      return companion.passenger_role === filter_users;
    }) || [];

  return (
    <div className="bg-white rounded-lg shadow-soft p-6">
      {/**
       * Filter buttons for helpers and seekers
       */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-neutral-900">Companions</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter("helper")}
            className={`px-2 py-1 rounded-md text-sm ${
              filter_users === "helper"
                ? "bg-primary-100 text-primary-800"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            Helpers
          </button>
          <button
            onClick={() => setFilter("seeker")}
            className={`px-2 py-1 rounded-md text-sm ${
              filter_users === "seeker"
                ? "bg-primary-100 text-primary-800"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            Help Seekers
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredCompanions.map((companion, index) => (
          <motion.div
            key={index}
            className={`border rounded-lg p-4 ${
              companion.status === "booked"
                ? "border-blue-200"
                : "border-green-200"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              {/* Avatar Icon */}
              <div className="flex-shrink-0">
                <div
                  className={`w-10 h-10 rounded-full ${
                    companion.passenger_role === "helper"
                      ? "bg-primary-100"
                      : "bg-secondary-100"
                  } flex items-center justify-center`}
                >
                  <User
                    className={`h-5 w-5 ${
                      companion.passenger_role === "helper"
                        ? "text-primary-600"
                        : "text-secondary-600"
                    }`}
                  />
                </div>
              </div>

              {/* Info Block */}
              <div className="flex-1 min-w-0 w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <p className="text-lg font-medium text-neutral-900">
                    {companion.name}
                  </p>
                  <span
                    className={`mt-1 md:mt-0 px-2 py-1 text-xs rounded-full ${getStatusColor(
                      companion.status || "vacant"
                    )}`}
                  >
                    {companion.status || "vacant"}
                  </span>
                </div>

                {companion.age && (
                  <p className="text-lg text-neutral-600">
                    {companion.age} years old
                  </p>
                )}
                {companion.passenger_role && (
                  <button className="text-sm font-medium bg-primary-700 text-white  capitalize border-white border-1 px-2 py-1 rounded-md">
                    {companion.passenger_role}
                  </button>
                )}

                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {companion.languages?.length > 0 && (
                    <div className="flex items-center text-sm text-neutral-900">
                      <Languages className="h-5 w-5 mr-1" />
                      {companion.languages.join(", ")}
                    </div>
                  )}
                  {companion.phonenumber && (
                    <div className="flex items-center text-sm text-neutral-900">
                      <Phone className="h-5 w-5 mr-1" />
                      Mobile No: {companion.phonenumber}
                    </div>
                  )}
                  {companion.emergencyPhone && (
                    <div className="flex items-center text-sm text-neutral-800">
                      <ShieldAlert className="h-5 w-5 mr-1 text-red-500" />
                      Emergency phone: {companion.emergencyPhone}
                    </div>
                  )}
                  {companion.country && (
                    <div className="flex items-center text-sm text-neutral-800">
                      <MapPin className="h-5 w-5 mr-1" />
                      From: {companion.country}
                    </div>
                  )}
                  {companion.email && (
                    <div className="flex items-center text-sm text-neutral-800">
                      <Mail className="h-5 w-5 mr-1" />
                      Mail : {companion.email}
                    </div>
                  )}
                </div>

                {companion.seatNumber && (
                  <p className="flex items-center text-sm text-neutral-800">
                    <ShieldUser className="h-5 w-5 mr-1" />
                    Seat: {companion.seatNumber}
                  </p>
                )}

                {companion.description && (
                  <p className="mt-2 text-sm text-neutral-800 flex items-start">
                    <NotebookText className="h-5 w-5 mr-1 mt-[2px]" />
                    <span>Description: {companion.description}</span>
                  </p>
                )}

                {companion.isPaidHelper && companion.helperPrice && (
                  <div className="mt-2 flex items-center text-sm font-medium text-primary-600">
                    <DollarSign className="h-4 w-4 mr-1" />
                    Helper Price: ${companion.helperPrice}/flight
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Flightcompanioncard;
