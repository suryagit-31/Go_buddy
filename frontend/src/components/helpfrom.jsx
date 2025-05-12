import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/authcontext";

import useFlightStore from "../store/useflightstore";

const Helpfrom = ({ flight_iata, flight_Date }) => {
  const { user } = useAuth();
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    age: "",
    languages: "",
    phone: "",
    type: "seeker",
    country: "",
    email: "",
    seatNumber: "",
    description: "",
    isPaidHelper: false,
    helperPrice: "",
    flight_iata: flight_iata,
    flight_date: flight_Date,
  });

  const flightDetails = {
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
        flight_iata: flight_iata,
        flight_date: flight_Date,
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
        isPaidHelper: false,
        helperPrice: "",
        flight_iata: flight_iata,
        flight_date: flight_Date,
      },
    ],
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = e.target.checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.description && formData.description.split(" ").length > 100) {
      alert("Description must not exceed 100 words");
      return;
    }
    console.log("Joining flight with details:", formData);
    setShowJoinForm(false);
  };

  return (
    <div>
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

      {showJoinForm && (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 space-y-4"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Flight Date
              </label>
              <input
                type="text"
                name="flight_date"
                value={flight_Date}
                placeholder={flight_Date}
                className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Flight IATA
              </label>
              <input
                type="text"
                name="flight_iata"
                value={flight_iata}
                placeholder={flight_iata}
                className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Name*
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2"
                required
                autoComplete="off"
                capitalize
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Age*
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                min="18"
                className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2"
                required
                autoComplete="off"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Languages*
              </label>
              <input
                type="text"
                name="languages"
                value={formData.languages}
                onChange={handleInputChange}
                placeholder="English, French"
                className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2"
                required
                autoComplete="off"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Phone Number*
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2"
                required
                autoComplete="off"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Country*
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2"
                required
                autoComplete="off"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Email*
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Seat Number
              </label>
              <input
                type="text"
                name="seatNumber"
                value={formData.seatNumber}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2"
                autoComplete="off"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700">
                I am a
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2"
                required 
              >
                <option value="helper">Helper</option>
                <option value="seeker">Help Seeker</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Description (max 100 words)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2"
              maxLength={500}
            />
            <p className="mt-1 text-sm text-neutral-500">
              {formData.description.split(" ").length}/100 words
            </p>
          </div>

          {formData.type === "helper" && (
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isPaidHelper"
                  checked={formData.isPaidHelper}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                />
                <label className="ml-2 block text-sm text-neutral-700">
                  I am a paid helper
                </label>
              </div>

              {formData.isPaidHelper && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700">
                    Helper Price ($)
                  </label>
                  <input
                    type="number"
                    name="helperPrice"
                    value={formData.helperPrice}
                    onChange={handleInputChange}
                    min="0"
                    className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2"
                    required
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex space-x-3">
            <motion.button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Join Flight
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setShowJoinForm(false)}
              className="px-4 py-2 border border-neutral-300 rounded-md hover:bg-neutral-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
          </div>
        </motion.form>
      )}
    </div>
  );
};

export default Helpfrom;
