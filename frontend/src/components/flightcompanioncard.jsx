import React from "react";
import { useState } from "react";
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

const Flightcompanioncard = () => {
  const flightDetails = {
    id: "1",
    flightNumber: "DL 114",
    from: "New York (JFK)",
    to: "Paris (CDG)",
    date: "May 20, 2025",
    departureTime: "10:30 AM",
    arrivalTime: "11:45 PM",
    terminal: "Terminal 4",
    gate: "Gate B12",
    companions: [
      {
        id: "1",
        name: "John Smith",
        age: 65,
        languages: ["English", "French"],
        phone: "+1 234-567-8900",
        type: "helper",
        status: "booked",
        country: "United States",
        email: "john@example.com",
        seatNumber: "12A",
        description:
          "Experienced traveler, happy to assist with luggage and navigation.",
        isPaidHelper: true,
        helperPrice: 50,
      },
      {
        id: "2",
        name: "Maria Garcia",
        age: 70,
        languages: ["Spanish", "English"],
        phone: "+1 234-567-8901",
        type: "seeker",
        status: "vacant",
        country: "Spain",
        email: "maria@example.com",
        seatNumber: "14C",
        description:
          "First time traveling to Paris, would appreciate help with transfers.",
      },
    ],
  };
  const [filter_users, setFilter] = useState("all");

  const filteredCompanions = flightDetails.companions.filter((companion) => {
    if (filter_users === "all") return true;
    if (filter_users === "helpers") return companion.type === "helper";
    if (filter_users === "seekers") return companion.type === "seeker";
    return true;
  });

  const getStatusColor = (status) => {
    return status === "booked"
      ? "bg-blue-100 text-blue-800"
      : "bg-green-100 text-green-800";
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-soft p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">Companions</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-2 py-1 rounded-md text-sm ${
                filter_users === "all"
                  ? "bg-primary-100 text-primary-800"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("helpers")}
              className={`px-2 py-1 rounded-md text-sm ${
                filter_users === "helpers"
                  ? "bg-primary-100 text-primary-800"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              Helpers
            </button>
            <button
              onClick={() => setFilter("seekers")}
              className={`px-2 py-1 rounded-md text-sm ${
                filter_users === "seekers"
                  ? "bg-primary-100 text-primary-800"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              Seekers
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredCompanions.map((companion) => (
            <motion.div
              key={companion.id}
              className={`border rounded-lg p-4 ${
                companion.status === "booked"
                  ? "border-blue-200"
                  : "border-green-200"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full ${
                      companion.type === "helper"
                        ? "bg-primary-100"
                        : "bg-secondary-100"
                    } flex items-center justify-center`}
                  >
                    <User
                      className={`h-5 w-5 ${
                        companion.type === "helper"
                          ? "text-primary-600"
                          : "text-secondary-600"
                      }`}
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-medium text-neutral-900">
                      {companion.name}
                    </p>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                        companion.status
                      )}`}
                    >
                      {companion.status}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600">
                    {companion.age} years old
                  </p>

                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {companion.languages && (
                      <div className="flex items-center text-sm text-neutral-600">
                        <Languages className="h-4 w-4 mr-1" />
                        {companion.languages.join(", ")}
                      </div>
                    )}
                    {companion.phone && (
                      <div className="flex items-center text-sm text-neutral-600">
                        <Phone className="h-4 w-4 mr-1" />
                        {companion.phone}
                      </div>
                    )}
                    {companion.country && (
                      <div className="flex items-center text-sm text-neutral-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {companion.country}
                      </div>
                    )}
                    {companion.email && (
                      <div className="flex items-center text-sm text-neutral-600">
                        <Mail className="h-4 w-4 mr-1" />
                        {companion.email}
                      </div>
                    )}
                  </div>

                  {companion.seatNumber && (
                    <p className="mt-2 text-sm text-neutral-600">
                      Seat: {companion.seatNumber}
                    </p>
                  )}

                  {companion.description && (
                    <p className="mt-2 text-sm text-neutral-600">
                      {companion.description}
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
    </div>
  );
};

export default Flightcompanioncard;
