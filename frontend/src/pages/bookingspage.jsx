import React, { use, useEffect, useState, useCallback } from "react";
import PageTransition from "../components/pagetransition";
import { motion } from "framer-motion";
import { Plane, Calendar, User, X, Hash, Phone } from "lucide-react";
import useAuthStore from "../store/useAuthstore";
import useFlightStore from "../store/useflightstore";

// Mock data

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const { authUser } = useAuthStore();
  const { Get_Mybookings, MyBookings } = useFlightStore();

  const handleCancelBooking = (bookingId) => {
    setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
  };

  const fetchUserBookings = useCallback(async () => {
    if (!authUser?.email) return;
    try {
      Get_Mybookings(authUser.email);
      if (MyBookings) setBookings(MyBookings);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  }, [authUser?.email, Get_Mybookings]);

  useEffect(() => {
    fetchUserBookings();
  }, [authUser?.email, Get_Mybookings]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-neutral-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-900">My Bookings</h1>
            <p className="mt-2 text-lg text-neutral-600">
              Manage your upcoming flights and travel companions
            </p>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-neutral-600">
                You don't have any bookings yet.
              </p>
              <motion.button
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Find a Flight
              </motion.button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {bookings.map((booking) => (
                <motion.div
                  key={booking._id}
                  className="bg-white shadow-soft rounded-lg overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Plane className="h-6 w-6 text-primary-600" />
                        <h3 className="text-lg font-semibold text-neutral-900">
                          {booking.flight_iata}
                        </h3>
                      </div>
                      <motion.button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="p-1 text-neutral-400 hover:text-error-600 focus:outline-none"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <X className="h-5 w-5" />
                      </motion.button>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Flight Date */}
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-neutral-400 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-neutral-500">
                            Flight Date
                          </p>
                          <p className="text-base text-neutral-900">
                            {new Date(booking.flight_date).toDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Seat Number */}
                      <div className="flex items-center">
                        <Hash className="h-5 w-5 text-neutral-400 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-neutral-500">
                            Seat Number
                          </p>
                          <p className="text-base text-neutral-900">
                            {booking.seatNumber || "Not Assigned"}
                          </p>
                        </div>
                      </div>

                      
                      {/* Passenger Role */}
                      <div className="flex items-center">
                        <Hash className="h-5 w-5 text-neutral-400 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-neutral-500">
                            Role
                          </p>
                          <p className="text-base text-neutral-900">
                            {booking.passenger_role || "Not Assigned"}
                          </p>

                          {booking.passenger_role === "helper" && (
                            <div className="flex items-center space-x-1 mt-1">
                              <span className="text-base text-neutral-900 font-medium">
                                Price: {booking.helperPrice ?? "Not Assigned"}
                              </span>
                              <DollarSign className="h-4 w-4 text-primary-600" />
                            </div>
                          )}
                        </div>
                      </div>


                      {/* Passenger Name */}
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-neutral-400 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-neutral-500">
                            Passenger Name
                          </p>
                          <p className="text-base text-neutral-900">
                            {booking.name}
                          </p>
                        </div>
                      </div>

                      {/* Phone Number */}
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-neutral-400 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-neutral-500">
                            Phone Number
                          </p>
                          <p className="text-base text-neutral-900">
                            {booking.phonenumber}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default BookingsPage;
