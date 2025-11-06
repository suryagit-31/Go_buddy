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
  UserPlus,
  Check,
  X,
  Clock,
  CheckCircle2,
  Crown,
} from "lucide-react";
import useFlightStore from "../store/useflightstore";
import useConnectionStore from "../store/useConnectionStore";
import useAuthStore from "../store/useAuthstore";

const Flightcompanioncard = ({ flight_iata, flight_date }) => {
  const { OtherCompanions } = useFlightStore();
  const { authUser } = useAuthStore();
  const {
    requestConnection,
    acceptConnection,
    rejectConnection,
    getConnectionStatus,
    isLoading,
  } = useConnectionStore();
  const [filter_users, setFilter] = useState("all");
  const [connectionStatuses, setConnectionStatuses] = useState({});

  const getStatusColor = (status) => {
    return status === "booked"
      ? "bg-blue-100 text-blue-800"
      : "bg-green-100 text-green-800";
  };

  // Fetch connection statuses for all companions
  useEffect(() => {
    if (!flight_iata || !flight_date || !OtherCompanions?.length) return;

    const fetchStatuses = async () => {
      const statusPromises = OtherCompanions.map(async (companion) => {
        const companionType =
          companion.passenger_role === "helper" ? "helper" : "seeker";
        const status = await getConnectionStatus(
          companionType,
          companion._id,
          flight_iata,
          flight_date
        );
        return { companionId: companion._id, status };
      });

      const results = await Promise.all(statusPromises);
      const statusMap = {};
      results.forEach(({ companionId, status }) => {
        statusMap[companionId] = status;
      });
      setConnectionStatuses(statusMap);
    };

    fetchStatuses();
  }, [OtherCompanions, flight_iata, flight_date, getConnectionStatus]);

  const filteredCompanions =
    OtherCompanions?.filter((companion) => {
      if (filter_users === "all") return true;
      return companion.passenger_role === filter_users;
    }) || [];

  const handleRequestConnection = async (companion) => {
    try {
      await requestConnection({
        companionRequestId: companion._id,
        companionType: companion.passenger_role,
        flight_iata,
        flight_date,
      });
      // Refresh status
      const status = await getConnectionStatus(
        companion.passenger_role,
        companion._id,
        flight_iata,
        flight_date
      );
      setConnectionStatuses((prev) => ({
        ...prev,
        [companion._id]: status,
      }));
    } catch (error) {
      console.error("Error requesting connection:", error);
    }
  };

  const handleAcceptConnection = async (connectionId) => {
    try {
      await acceptConnection(connectionId);
      // Refresh all statuses
      const statusPromises = OtherCompanions.map(async (companion) => {
        const companionType =
          companion.passenger_role === "helper" ? "helper" : "seeker";
        const status = await getConnectionStatus(
          companionType,
          companion._id,
          flight_iata,
          flight_date
        );
        return { companionId: companion._id, status };
      });
      const results = await Promise.all(statusPromises);
      const statusMap = {};
      results.forEach(({ companionId, status }) => {
        statusMap[companionId] = status;
      });
      setConnectionStatuses(statusMap);
    } catch (error) {
      console.error("Error accepting connection:", error);
    }
  };

  const handleRejectConnection = async (connectionId) => {
    try {
      await rejectConnection(connectionId);
      // Refresh all statuses
      const statusPromises = OtherCompanions.map(async (companion) => {
        const companionType =
          companion.passenger_role === "helper" ? "helper" : "seeker";
        const status = await getConnectionStatus(
          companionType,
          companion._id,
          flight_iata,
          flight_date
        );
        return { companionId: companion._id, status };
      });
      const results = await Promise.all(statusPromises);
      const statusMap = {};
      results.forEach(({ companionId, status }) => {
        statusMap[companionId] = status;
      });
      setConnectionStatuses(statusMap);
    } catch (error) {
      console.error("Error rejecting connection:", error);
    }
  };

  const getConnectionButton = (companion) => {
    const statusData = connectionStatuses[companion._id];
    const connectionStatus = statusData?.status || "none";
    const connection = statusData?.connection;

    // Don't show button if it's the current user's own request
    // Check both userId and email to be safe
    const companionUserId = companion.userId?.toString
      ? companion.userId.toString()
      : companion.userId;
    const authUserId = authUser?.Id?.toString
      ? authUser.Id.toString()
      : authUser?.Id;

    const isOwnRequest =
      (companionUserId && authUserId && companionUserId === authUserId) ||
      (companion.email &&
        authUser?.email &&
        companion.email.toLowerCase() === authUser.email.toLowerCase());

    if (isOwnRequest) {
      return null;
    }

    // Check if user has a pending request from this companion
    const isPendingRequest =
      connection?.status === "pending" &&
      (connection?.requestedTo?._id?.toString() === authUser?.Id?.toString() ||
        connection?.requestedTo?.toString() === authUser?.Id?.toString());

    if (connectionStatus === "none") {
      return (
        <motion.button
          onClick={() => handleRequestConnection(companion)}
          disabled={isLoading}
          className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <UserPlus className="h-4 w-4" />
          Connect
        </motion.button>
      );
    }

    if (connectionStatus === "pending") {
      if (isPendingRequest) {
        return (
          <div className="mt-2 flex gap-2">
            <motion.button
              onClick={() => handleAcceptConnection(connection._id)}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Check className="h-4 w-4" />
              Accept
            </motion.button>
            <motion.button
              onClick={() => handleRejectConnection(connection._id)}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <X className="h-4 w-4" />
              Reject
            </motion.button>
          </div>
        );
      } else {
        return (
          <div className="mt-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Request Pending
          </div>
        );
      }
    }

    if (connectionStatus === "accepted") {
      return (
        <div className="mt-2 px-4 py-2 bg-green-100 text-green-800 rounded-md flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          Connected
        </div>
      );
    }

    if (connectionStatus === "rejected") {
      return (
        <div className="mt-2 px-4 py-2 bg-red-100 text-red-800 rounded-md">
          Connection Rejected
        </div>
      );
    }

    if (connectionStatus === "completed") {
      return (
        <div className="mt-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-md">
          Completed
        </div>
      );
    }

    return null;
  };

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
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-medium text-neutral-900">
                      {companion.name}
                    </p>
                    {companion.isPro && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 text-white text-xs font-semibold rounded-full">
                        <Crown className="h-3 w-3" />
                        Pro
                      </span>
                    )}
                  </div>
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

                {/* Connection Button */}
                {getConnectionButton(companion)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Flightcompanioncard;
