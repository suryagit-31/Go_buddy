import React, { useState } from "react";
import PageTransition from "../components/pagetransition";
import { motion } from "framer-motion";
import { Plane, Calendar, User, X } from "lucide-react";

// Mock data
const mockBookings = [
  {
    id: "1",
    flightNumber: "DL 114",
    from: "New York",
    to: "Paris",
    date: "May 20, 2025",
    companion: "Annette Black",
  },
];

const BookingsPage = () => {
  const [bookings, setBookings] = useState(mockBookings);

  const handleCancelBooking = (bookingId) => {
    setBookings(bookings.filter((booking) => booking.id !== bookingId));
  };

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
                  key={booking.id}
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
                          {booking.flightNumber}
                        </h3>
                      </div>
                      <motion.button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="p-1 text-neutral-400 hover:text-error-600 focus:outline-none"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <X className="h-5 w-5" />
                      </motion.button>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="flex items-center">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-neutral-500">
                              From
                            </p>
                            <p className="text-base text-neutral-900">
                              {booking.from}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-neutral-500">
                              To
                            </p>
                            <p className="text-base text-neutral-900">
                              {booking.to}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-neutral-400 mr-2" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-neutral-500">
                              Date
                            </p>
                            <p className="text-base text-neutral-900">
                              {booking.date}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-neutral-200">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-neutral-400 mr-2" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-neutral-500">
                            Travel Companion
                          </p>
                          {booking.companion ? (
                            <p className="text-base text-neutral-900">
                              {booking.companion}
                            </p>
                          ) : (
                            <div className="flex items-center mt-1">
                              <p className="text-sm text-neutral-600">
                                No companion yet
                              </p>
                              <motion.button
                                className="ml-4 px-3 py-1 text-xs font-medium rounded-md text-primary-700 bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Find a Companion
                              </motion.button>
                            </div>
                          )}
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
