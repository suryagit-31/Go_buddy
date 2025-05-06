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

const FlightJoinpage = () => {
  const { user } = useAuth();
  const { iata, date } = useParams();
  const [flightData, setFlightData] = useState([]);
  const { join_flight, get_joinflight, is_joiningflight } = useFlightStore();

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
  });

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

  useEffect(() => {
    const fetchData = async () => {
      await get_joinflight(iata, date);
      setFlightData(join_flight); 
    };
    fetchData();
  }, [iata, date]);


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
    <PageTransition>
      {
        <div className="min-h-screen bg-neutral-50 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Flight Details Section */}
              <div>
                <div className="bg-white rounded-lg shadow-soft p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-neutral-900">
                      Flight Details
                    </h2>
                    <Plane className="h-6 w-6 text-primary-600" />
                  </div>

                  <dl className="grid grid-cols-1 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-neutral-500">
                        {flightData.flight.iata}
                      </dt>
                      <dd className="mt-1 text-lg text-neutral-900">
                        {flightDetails.flightNumber}
                      </dd>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <dt className="text-sm font-medium text-neutral-500">
                          From
                        </dt>
                        <dd className="mt-1 text-lg text-neutral-900">
                          {flightDetails.from}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-neutral-500">
                          To
                        </dt>
                        <dd className="mt-1 text-lg text-neutral-900">
                          {flightDetails.to}
                        </dd>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <dt className="text-sm font-medium text-neutral-500">
                          Departure
                        </dt>
                        <dd className="mt-1 text-lg text-neutral-900">
                          {flightDetails.departureTime}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-neutral-500">
                          Arrival
                        </dt>
                        <dd className="mt-1 text-lg text-neutral-900">
                          {flightDetails.arrivalTime}
                        </dd>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <dt className="text-sm font-medium text-neutral-500">
                          Terminal
                        </dt>
                        <dd className="mt-1 text-lg text-neutral-900">
                          {flightDetails.terminal}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-neutral-500">
                          Gate
                        </dt>
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
                            Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700">
                            Age
                          </label>
                          <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleInputChange}
                            min="18"
                            className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700">
                            Languages
                          </label>
                          <input
                            type="text"
                            name="languages"
                            value={formData.languages}
                            onChange={handleInputChange}
                            placeholder="English, French"
                            className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700">
                            Country
                          </label>
                          <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700">
                            Email
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
