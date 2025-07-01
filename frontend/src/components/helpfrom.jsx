import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/authcontext";

import useFlightStore from "../store/useflightstore";

const Helpfrom = ({ flight_iata, flight_Date }) => {
  const { user } = useAuth();
  const [showJoinForm, setShowJoinForm] = useState(false);
  const { joinFlightasCompanion } = useFlightStore();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    age: "",
    languages: "",
    phonenumber: "",
    passenger_role: "seeker",
    country: "",
    email: "",
    seatNumber: "",
    description: "",
    isPaidHelper: false,
    helperPrice: "",
    flight_iata: flight_iata,
    flight_date: flight_Date,
  });

  const flightDetails = {};

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = e.target.checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.description && formData.description.split(" ").length > 100) {
      alert("Description must not exceed 100 words");
      return;
    }

    const payload = {
      name: formData.name,
      age: Number(formData.age),
      languages: formData.languages,
      phonenumber: formData.phonenumber,
      email: formData.email,
      country: formData.country,
      seatNumber: formData.seatNumber,
      description: formData.description,
      passenger_role: formData.passenger_role,
      isPaidHelper: formData.isPaidHelper,
      helperPrice: formData.helperPrice,
      flightiata: formData.flight_iata,
      flightdate: formData.flight_date,
      userID: user?._id || "user31", // fallback or inject real ID
    };
    try {
      await joinFlightasCompanion(payload);
      alert("✅ Successfully joined the flight!");
      setShowJoinForm(false);
    } catch (error) {
      alert("❌ Failed to join flight. Please try again later.");
    } finally {
      setShowJoinForm(false);
      console.log("Joining flight with details:", formData);
    }
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
                type="date"
                name="flight_date"
                value={flight_Date}
                placeholder={
                  typeof flight_Date === "string"
                    ? flight_Date
                    : flight_Date instanceof Date
                    ? flight_Date.toISOString().split("T")[0]
                    : ""
                }
                className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 capitalize"
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
                placeholder={flight_iata || "IATA not found"}
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
                name="phonenumber"
                value={formData.phonenumber}
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
                name="passenger_role"
                value={formData.passenger_role}
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
