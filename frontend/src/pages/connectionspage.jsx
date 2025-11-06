import React, { useEffect, useState } from "react";
import PageTransition from "../components/pagetransition";
import { motion } from "framer-motion";
import {
  Plane,
  User,
  Calendar,
  CheckCircle2,
  Clock,
  X,
  CheckCircle,
  XCircle,
  Filter,
} from "lucide-react";
import useConnectionStore from "../store/useConnectionStore";
import useAuthStore from "../store/useAuthstore";

const ConnectionsPage = () => {
  const { authUser } = useAuthStore();
  const {
    connections,
    getUserConnections,
    acceptConnection,
    rejectConnection,
    completeConnection,
    cancelConnection,
    isLoading,
  } = useConnectionStore();
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    getUserConnections(statusFilter === "all" ? null : statusFilter);
  }, [statusFilter, getUserConnections]);

  const getStatusBadge = (status) => {
    const badges = {
      pending: {
        icon: Clock,
        className: "bg-yellow-100 text-yellow-800",
        text: "Pending",
      },
      accepted: {
        icon: CheckCircle,
        className: "bg-green-100 text-green-800",
        text: "Accepted",
      },
      rejected: {
        icon: XCircle,
        className: "bg-red-100 text-red-800",
        text: "Rejected",
      },
      completed: {
        icon: CheckCircle2,
        className: "bg-blue-100 text-blue-800",
        text: "Completed",
      },
      cancelled: {
        icon: X,
        className: "bg-gray-100 text-gray-800",
        text: "Cancelled",
      },
    };

    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${badge.className}`}
      >
        <Icon className="h-4 w-4" />
        {badge.text}
      </span>
    );
  };

  const getOtherUser = (connection) => {
    if (
      connection.helperUserId?._id?.toString() === authUser?.Id ||
      connection.helperUserId?.toString() === authUser?.Id
    ) {
      return connection.seekerUserId;
    }
    return connection.helperUserId;
  };

  const getRole = (connection) => {
    if (
      connection.helperUserId?._id?.toString() === authUser?.Id ||
      connection.helperUserId?.toString() === authUser?.Id
    ) {
      return "Helper";
    }
    return "Help Seeker";
  };

  const handleAccept = async (connectionId) => {
    await acceptConnection(connectionId);
  };

  const handleReject = async (connectionId) => {
    if (
      window.confirm("Are you sure you want to reject this connection request?")
    ) {
      await rejectConnection(connectionId);
    }
  };

  const handleComplete = async (connectionId) => {
    if (
      window.confirm(
        "Are you sure you want to mark this connection as completed?"
      )
    ) {
      await completeConnection(connectionId);
    }
  };

  const handleCancel = async (connectionId) => {
    if (window.confirm("Are you sure you want to cancel this connection?")) {
      await cancelConnection(connectionId);
    }
  };

  const filteredConnections =
    statusFilter === "all"
      ? connections
      : connections.filter((c) => c.status === statusFilter);

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
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
              <User className="h-8 w-8 text-primary-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-3">
              My Connections
            </h1>
            <p className="text-lg md:text-xl text-neutral-600">
              Manage your flight companion connections
            </p>
          </motion.div>

          {/* Filter Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-8 flex flex-wrap gap-3 justify-center"
          >
            <motion.button
              onClick={() => setStatusFilter("all")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                statusFilter === "all"
                  ? "bg-primary-600 text-white shadow-lg"
                  : "bg-white text-neutral-700 hover:bg-neutral-100 shadow-sm"
              }`}
            >
              <Filter className="h-4 w-4" />
              All
            </motion.button>
            {["pending", "accepted", "completed", "rejected", "cancelled"].map(
              (status) => (
                <motion.button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium capitalize transition-all ${
                    statusFilter === status
                      ? "bg-primary-600 text-white shadow-lg"
                      : "bg-white text-neutral-700 hover:bg-neutral-100 shadow-sm"
                  }`}
                >
                  {status}
                </motion.button>
              )
            )}
          </motion.div>

          {isLoading && connections.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
              <p className="text-lg text-neutral-600">Loading connections...</p>
            </motion.div>
          ) : filteredConnections.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-white rounded-2xl shadow-soft"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neutral-100 mb-4">
                <User className="h-10 w-10 text-neutral-400" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                No connections found
              </h3>
              <p className="text-neutral-600">
                {statusFilter === "all"
                  ? "You don't have any connections yet."
                  : `No ${statusFilter} connections found.`}
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {filteredConnections.map((connection, index) => {
                const otherUser = getOtherUser(connection);
                const role = getRole(connection);
                const isRequestedByMe =
                  connection.requestedBy?._id?.toString() === authUser?.Id ||
                  connection.requestedBy?.toString() === authUser?.Id;

                return (
                  <motion.div
                    key={connection._id}
                    variants={cardVariants}
                    layout
                    className="bg-white shadow-lg rounded-xl overflow-hidden border border-neutral-100 hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="p-6 md:p-8">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-4 border-b border-neutral-200">
                        <div className="flex items-center gap-4">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg"
                          >
                            <User className="h-7 w-7 text-white" />
                          </motion.div>
                          <div>
                            <h3 className="text-xl font-bold text-neutral-900">
                              {otherUser?.name || "Unknown User"}
                            </h3>
                            <p className="text-sm text-neutral-600 mt-1">
                              {role} • {otherUser?.email || ""}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(connection.status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-start gap-3 p-4 bg-neutral-50 rounded-lg"
                        >
                          <Plane className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-neutral-500 mb-1">
                              Flight
                            </p>
                            <p className="text-base font-semibold text-neutral-900">
                              {connection.flight_iata}
                            </p>
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 + 0.1 }}
                          className="flex items-start gap-3 p-4 bg-neutral-50 rounded-lg"
                        >
                          <Calendar className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-neutral-500 mb-1">
                              Flight Date
                            </p>
                            <p className="text-base font-semibold text-neutral-900">
                              {new Date(
                                connection.flight_date
                              ).toLocaleDateString("en-US", {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </motion.div>
                      </div>

                      {connection.acceptedAt && (
                        <div className="mt-4 text-sm text-neutral-600">
                          Accepted on:{" "}
                          {new Date(connection.acceptedAt).toLocaleDateString()}
                        </div>
                      )}

                      {connection.completedAt && (
                        <div className="mt-2 text-sm text-neutral-600">
                          Completed on:{" "}
                          {new Date(
                            connection.completedAt
                          ).toLocaleDateString()}
                        </div>
                      )}

                      {isRequestedByMe && connection.status === "pending" && (
                        <div className="mt-4 text-sm text-neutral-500">
                          You sent this connection request
                        </div>
                      )}

                      {!isRequestedByMe && connection.status === "pending" && (
                        <div className="mt-4 text-sm text-neutral-500">
                          You received this connection request
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 pt-4 border-t border-neutral-200">
                        {connection.status === "pending" &&
                          !isRequestedByMe && (
                            <>
                              <motion.button
                                onClick={() => handleAccept(connection._id)}
                                disabled={isLoading}
                                className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2 font-medium shadow-sm"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <CheckCircle className="h-4 w-4" />
                                Accept
                              </motion.button>
                              <motion.button
                                onClick={() => handleReject(connection._id)}
                                disabled={isLoading}
                                className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 font-medium shadow-sm"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <X className="h-4 w-4" />
                                Reject
                              </motion.button>
                            </>
                          )}
                        {connection.status === "accepted" && (
                          <>
                            <motion.button
                              onClick={() => handleComplete(connection._id)}
                              disabled={isLoading}
                              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 font-medium shadow-sm"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Mark as Completed
                            </motion.button>
                            <motion.button
                              onClick={() => handleCancel(connection._id)}
                              disabled={isLoading}
                              className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 font-medium shadow-sm"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <X className="h-4 w-4" />
                              Cancel
                            </motion.button>
                          </>
                        )}
                        {connection.status === "pending" && isRequestedByMe && (
                          <motion.button
                            onClick={() => handleCancel(connection._id)}
                            disabled={isLoading}
                            className="px-5 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 font-medium shadow-sm"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Cancel Request
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default ConnectionsPage;
