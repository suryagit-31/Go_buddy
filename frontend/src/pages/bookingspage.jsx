import React, { useEffect, useState, useCallback } from "react";
import PageTransition from "../components/pagetransition";
<<<<<<< HEAD
import { motion, AnimatePresence } from "framer-motion";
import {
  Plane,
  Calendar,
  User,
  X,
  Hash,
  Phone,
  DollarSign,
  MapPin,
  Clock,
  Search,
  Loader,
} from "lucide-react";
=======
import { motion } from "framer-motion";
import { Plane, Calendar, User, X, Hash,  DollarSign, Phone } from "lucide-react";
>>>>>>> 30b81bf8857f2dc693297013e31a48c449b043af
import useAuthStore from "../store/useAuthstore";
import useFlightStore from "../store/useflightstore";
import { useNavigate } from "react-router-dom";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { authUser } = useAuthStore();
  const { Get_Mybookings, MyBookings, cancelBooking } = useFlightStore();
  const navigate = useNavigate();

  const fetchUserBookings = useCallback(async () => {
    if (!authUser?.email) {
      setBookings([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      await Get_Mybookings(authUser.email);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  }, [authUser?.email, Get_Mybookings]);

  useEffect(() => {
    fetchUserBookings();
  }, [authUser?.email, Get_Mybookings]);

  useEffect(() => {
    if (Array.isArray(MyBookings)) {
      setBookings(MyBookings);
    } else {
      setBookings([]);
    }
  }, [MyBookings]);

  const handleCancelBooking = async (bookingId) => {
    const previousBookings = bookings;
    setBookings((prev) => prev.filter((booking) => booking._id !== bookingId));
    try {
      await cancelBooking(bookingId);
    } catch (error) {
      setBookings(previousBookings);
      console.error("Error cancelling booking:", error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
              <Calendar className="h-8 w-8 text-primary-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-3">
              My Bookings
            </h1>
            <p className="text-lg md:text-xl text-neutral-600">
              Manage your upcoming flights and travel companions
            </p>
          </motion.div>

          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <Loader className="h-12 w-12 animate-spin text-primary-600 mb-4" />
              <p className="text-lg text-neutral-600">
                Loading your bookings...
              </p>
            </motion.div>
          ) : bookings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-white rounded-2xl shadow-soft"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neutral-100 mb-4">
                <Plane className="h-10 w-10 text-neutral-400" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                No bookings yet
              </h3>
              <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                You don't have any bookings yet. Start by searching for flights
                and connecting with travel companions.
              </p>
              <motion.button
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/search")}
              >
                <Search className="h-5 w-5" />
                Find a Flight
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <AnimatePresence>
                {bookings.map((booking, index) => (
                  <motion.div
                    key={booking._id}
                    variants={cardVariants}
                    layout
                    className="bg-white shadow-lg rounded-xl overflow-hidden border border-neutral-100 hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="p-6 md:p-8">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-200">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                            <Plane className="h-6 w-6 text-primary-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-neutral-900">
                              Flight {booking.flight_iata}
                            </h3>
                            <p className="text-sm text-neutral-500 mt-1">
                              Booking ID: {booking._id.slice(-8)}
                            </p>
                          </div>
                        </div>
                        <motion.button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="p-2 text-neutral-400 hover:text-error-600 focus:outline-none rounded-lg hover:bg-error-50 transition-colors"
                          whileHover={{ rotate: 90, scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <X className="h-5 w-5" />
                        </motion.button>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Flight Date */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-start gap-3 p-4 bg-neutral-50 rounded-lg"
                        >
                          <Calendar className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-neutral-500 mb-1">
                              Flight Date
                            </p>
                            <p className="text-base font-semibold text-neutral-900">
                              {new Date(booking.flight_date).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "short",
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </motion.div>

<<<<<<< HEAD
                        {/* Seat Number */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 + 0.1 }}
                          className="flex items-start gap-3 p-4 bg-neutral-50 rounded-lg"
                        >
                          <Hash className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-neutral-500 mb-1">
                              Seat Number
                            </p>
                            <p className="text-base font-semibold text-neutral-900">
                              {booking.seatNumber || (
                                <span className="text-neutral-400 italic">
                                  Not Assigned
                                </span>
                              )}
                            </p>
                          </div>
                        </motion.div>
=======
                      
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
>>>>>>> 30b81bf8857f2dc693297013e31a48c449b043af

                        {/* Passenger Role */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 + 0.2 }}
                          className="flex items-start gap-3 p-4 bg-neutral-50 rounded-lg"
                        >
                          <User className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-neutral-500 mb-1">
                              Role
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-base font-semibold text-neutral-900 capitalize">
                                {booking.passenger_role || "Not Assigned"}
                              </span>
                              {booking.passenger_role === "helper" &&
                                booking.helperPrice && (
                                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                                    <DollarSign className="h-3 w-3" />
                                    {booking.helperPrice}
                                  </span>
                                )}
                            </div>
                          </div>
                        </motion.div>

                        {/* Passenger Name */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 + 0.3 }}
                          className="flex items-start gap-3 p-4 bg-neutral-50 rounded-lg"
                        >
                          <User className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-neutral-500 mb-1">
                              Passenger Name
                            </p>
                            <p className="text-base font-semibold text-neutral-900">
                              {booking.name}
                            </p>
                          </div>
                        </motion.div>

                        {/* Phone Number */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 + 0.4 }}
                          className="flex items-start gap-3 p-4 bg-neutral-50 rounded-lg"
                        >
                          <Phone className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-neutral-500 mb-1">
                              Phone Number
                            </p>
                            <p className="text-base font-semibold text-neutral-900">
                              {booking.phonenumber}
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default BookingsPage;
