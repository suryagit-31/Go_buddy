import React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useAuthStore from "../store/useAuthstore";
import useFlightStore from "../store/useflightstore";
import { CalendarHeart, Plane, ShieldPlus } from "lucide-react";

const Helpfrom = ({ flight_iata, flight_Date }) => {
  const [showJoinForm, setShowJoinForm] = useState(false);
  const { joinFlightasCompanion, get_OtherCompanions } = useFlightStore();
  const { authUser } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
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
    flight_date:
      typeof flight_Date === "string"
        ? flight_Date
        : flight_Date instanceof Date
        ? flight_Date.toISOString().split("T")[0]
        : "",
    emergencyPhone: "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      flight_iata: flight_iata || "",
      flight_date:
        typeof flight_Date === "string"
          ? flight_Date
          : flight_Date instanceof Date
          ? flight_Date.toISOString().split("T")[0]
          : "",
    }));
  }, [flight_iata, flight_Date]);

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
    console.log("Form data:", formData);
    if (formData.description && formData.description.split(" ").length > 100) {
      alert("Description must not exceed 100 words");
      return;
    }

    const payload = {
      name: formData.name,
      age: Number(formData.age),
      languages: formData.languages,
      email: formData.email,
      country: formData.country,
      phonenumber: formData.phonenumber,
      seatNumber: formData.seatNumber,
      description: formData.description,
      passenger_role: formData.passenger_role,
      isPaidHelper: formData.isPaidHelper,
      helperPrice: formData.helperPrice,
      flight_iata: formData.flight_iata,
      flight_date: formData.flight_date,
      userID: authUser.Id,
      emergencyPhone: formData.emergencyPhone, // fallback or inject real ID
    };
    try {
      await joinFlightasCompanion(payload);
      setShowJoinForm(false);
      await get_OtherCompanions(formData.flight_iata, formData.flight_date);
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
          <motion.button
            type="button"
            onClick={() => {
              setFormData((prev) => ({
                ...prev,
                name: authUser?.name || "",
                age: authUser?.age || "",
                languages: authUser?.languages || "",
                phonenumber: authUser?.phone || "",
                email: authUser?.email || "",
                country: authUser?.city || "",
                description: authUser?.medicalConditions || "",
                emergencyPhone: authUser?.emergencyphone || "",
              }));
            }}
            className="mb-2 px-4 py-2 border border-primary-600 text-primary-700 rounded-md hover:bg-primary-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Fill with Profile
          </motion.button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1 text-sm font-medium text-primary-700">
                Flight Date <CalendarHeart size={16} />
              </label>
              <input
                type="date"
                name="flight_date"
                value={formData.flight_date}
                placeholder={
                  typeof flight_Date === "string"
                    ? flight_Date
                    : flight_Date instanceof Date
                    ? flight_Date.toISOString().split("T")[0]
                    : ""
                }
                disabled
                className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 "
              />
            </div>

            <div>
              <label className="flex items-center gap-1 text-sm font-medium text-primary-700">
                Flight IATA <Plane size={16} />
              </label>
              <input
                type="text"
                name="flight_iata"
                value={formData.flight_iata}
                placeholder={formData.flight_iata || "IATA not found"}
                className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Name *
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
                placeholder="English,French"
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
                Contact Mail *
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
            {formData.passenger_role === "seeker" && (
              <div>
                <label className="flex items-center gap-1 text-sm font-medium text-red-500">
                  <ShieldPlus size={16} />
                  Emergency Contact Phone *
                </label>
                <input
                  type="tel"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2"
                  required
                  autoComplete="off"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700">
              MedicalConditions or Description (max 100 words)
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

          {formData.passenger_role === "helper" && (
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isPaidHelper"
                  checked={formData.isPaidHelper}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-primary-500 border-neutral-300 rounded"
                />
                <label className="ml-2 block text-lg text-primary-700">
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
