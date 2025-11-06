import Connection from "../models/Connection.model.js";
import { HelperRequest } from "../models/Helper.model.js";
import { HelpSeekerRequest } from "../models/Helpseekers.model.js";
import User from "../models/User.model.js";
import Payment from "../models/Payment.model.js";
import { releasePayment, refundPayment } from "../services/stripeService.js";

// Request a connection with another companion
export const requestConnection = async (req, res) => {
  try {
    const { companionRequestId, companionType, flight_iata, flight_date } =
      req.body;
    const currentUser = req.user;

    if (!companionRequestId || !companionType || !flight_iata || !flight_date) {
      return res.status(400).json({
        message:
          "Missing required fields: companionRequestId, companionType, flight_iata, flight_date",
      });
    }

    // Find the companion request
    let companionRequest;
    let otherUser;

    if (companionType === "helper") {
      companionRequest = await HelperRequest.findById(companionRequestId);
    } else if (companionType === "seeker") {
      companionRequest = await HelpSeekerRequest.findById(companionRequestId);
    } else {
      return res.status(400).json({ message: "Invalid companionType" });
    }

    if (!companionRequest) {
      return res.status(404).json({ message: "Companion request not found" });
    }

    // Get the other user's ID
    if (companionRequest.userId) {
      // Handle both ObjectId and string formats
      const userId = companionRequest.userId.toString
        ? companionRequest.userId.toString()
        : companionRequest.userId;
      otherUser = await User.findById(userId);

      // If not found by ID, try email fallback
      if (!otherUser && companionRequest.email) {
        otherUser = await User.findOne({ email: companionRequest.email });
      }
    } else if (companionRequest.email) {
      // Fallback to email if userId not set
      otherUser = await User.findOne({ email: companionRequest.email });
    }

    if (!otherUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent self-connection - compare both ID and email
    const currentUserId = currentUser._id.toString();
    const otherUserId = otherUser._id.toString();
    const currentUserEmail = currentUser.email?.toLowerCase();
    const otherUserEmail = otherUser.email?.toLowerCase();

    if (currentUserId === otherUserId || currentUserEmail === otherUserEmail) {
      console.log("Self-connection attempt detected:", {
        currentUserId,
        otherUserId,
        currentUserEmail,
        otherUserEmail,
        companionRequestId,
        companionType,
      });
      return res.status(400).json({ message: "Cannot connect with yourself" });
    }

    // PRO FEATURE: Check connection limits for free users
    const currentUserFull = await User.findById(currentUser._id);
    const isPro =
      currentUserFull?.subscription?.plan === "pro" &&
      currentUserFull?.subscription?.status === "active";

    if (!isPro) {
      // Free users: Max 3 active connections (pending + accepted)
      const activeConnectionsCount = await Connection.countDocuments({
        $or: [
          { helperUserId: currentUser._id },
          { seekerUserId: currentUser._id },
        ],
        status: { $in: ["pending", "accepted"] },
      });

      if (activeConnectionsCount >= 3) {
        return res.status(403).json({
          message:
            "Free users can have maximum 3 active connections. Upgrade to Buddy Pro for unlimited connections.",
          requiresPro: true,
          limit: 3,
          current: activeConnectionsCount,
        });
      }
    }

    // Check if connection already exists
    const existingConnection = await Connection.findOne({
      $or: [
        {
          helperUserId: currentUser._id,
          seekerUserId: otherUser._id,
          flight_iata,
          flight_date: new Date(flight_date),
        },
        {
          helperUserId: otherUser._id,
          seekerUserId: currentUser._id,
          flight_iata,
          flight_date: new Date(flight_date),
        },
      ],
    });

    if (existingConnection) {
      return res.status(400).json({
        message: "Connection already exists",
        connection: existingConnection,
      });
    }

    // Determine helper and seeker based on companion types
    let helperUserId, seekerUserId, helperRequestId, seekerRequestId;

    if (companionType === "helper") {
      // Current user is a seeker, requesting a helper
      seekerUserId = currentUser._id;
      helperUserId = otherUser._id;
      helperRequestId = companionRequestId;
      // Find seeker request for current user
      const seekerRequest = await HelpSeekerRequest.findOne({
        userId: currentUser._id,
        flight_iata,
        flight_date: new Date(flight_date),
      });
      seekerRequestId = seekerRequest?._id;
    } else {
      // Current user is a helper, requesting a seeker
      helperUserId = currentUser._id;
      seekerUserId = otherUser._id;
      seekerRequestId = companionRequestId;
      // Find helper request for current user
      const helperRequest = await HelperRequest.findOne({
        userId: currentUser._id,
        flight_iata,
        flight_date: new Date(flight_date),
      });
      helperRequestId = helperRequest?._id;
    }

    // Create connection request
    const connection = new Connection({
      helperRequestId,
      seekerRequestId,
      helperUserId,
      seekerUserId,
      flight_iata,
      flight_date: new Date(flight_date),
      status: "pending",
      requestedBy: currentUser._id,
      requestedTo: otherUser._id,
    });

    await connection.save();

    // Populate user details
    await connection.populate([
      { path: "helperUserId", select: "name email" },
      { path: "seekerUserId", select: "name email" },
      { path: "requestedBy", select: "name email" },
      { path: "requestedTo", select: "name email" },
    ]);

    res.status(201).json({
      message: "Connection request sent successfully",
      connection,
    });
  } catch (error) {
    console.error("Error requesting connection:", error);
    res.status(500).json({ error: error.message });
  }
};

// Accept a connection request
export const acceptConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const currentUser = req.user;

    const connection = await Connection.findById(connectionId).populate(
      "helperRequestId"
    );

    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    // Check if user is the recipient of the request
    if (connection.requestedTo.toString() !== currentUser._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to accept this connection" });
    }

    // Check if already accepted/rejected
    if (connection.status !== "pending") {
      return res.status(400).json({
        message: `Connection is already ${connection.status}`,
      });
    }

    connection.status = "accepted";
    connection.acceptedAt = new Date();
    await connection.save();

    // Check if helper is paid and payment needs to be initialized
    const helperRequest = await HelperRequest.findById(
      connection.helperRequestId
    );
    let requiresPayment = false;

    if (
      helperRequest &&
      helperRequest.isPaidHelper &&
      helperRequest.helperPrice
    ) {
      requiresPayment = true;
      // Payment will be initialized by seeker via /payments/initialize endpoint
    }

    await connection.populate([
      { path: "helperUserId", select: "name email" },
      { path: "seekerUserId", select: "name email" },
      { path: "requestedBy", select: "name email" },
      { path: "requestedTo", select: "name email" },
    ]);

    res.status(200).json({
      message: "Connection accepted successfully",
      connection,
      requiresPayment, // Inform frontend that payment is needed
      helperPrice: helperRequest?.helperPrice || null,
    });
  } catch (error) {
    console.error("Error accepting connection:", error);
    res.status(500).json({ error: error.message });
  }
};

// Reject a connection request
export const rejectConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const currentUser = req.user;

    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    // Check if user is the recipient of the request
    if (connection.requestedTo.toString() !== currentUser._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to reject this connection" });
    }

    if (connection.status !== "pending") {
      return res.status(400).json({
        message: `Connection is already ${connection.status}`,
      });
    }

    connection.status = "rejected";
    await connection.save();

    res.status(200).json({
      message: "Connection rejected",
      connection,
    });
  } catch (error) {
    console.error("Error rejecting connection:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all connections for current user
export const getUserConnections = async (req, res) => {
  try {
    const currentUser = req.user;
    const { status } = req.query; // Optional filter by status

    const query = {
      $or: [
        { helperUserId: currentUser._id },
        { seekerUserId: currentUser._id },
      ],
    };

    if (status) {
      query.status = status;
    }

    const connections = await Connection.find(query)
      .populate("helperUserId", "name email")
      .populate("seekerUserId", "name email")
      .populate("requestedBy", "name email")
      .populate("requestedTo", "name email")
      .populate("helperRequestId")
      .populate("seekerRequestId")
      .sort({ createdAt: -1 });

    res.status(200).json(connections);
  } catch (error) {
    console.error("Error fetching connections:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get pending connection requests (received by user)
export const getPendingRequests = async (req, res) => {
  try {
    const currentUser = req.user;

    const pendingConnections = await Connection.find({
      requestedTo: currentUser._id,
      status: "pending",
    })
      .populate("helperUserId", "name email")
      .populate("seekerUserId", "name email")
      .populate("requestedBy", "name email")
      .populate("helperRequestId")
      .populate("seekerRequestId")
      .sort({ createdAt: -1 });

    res.status(200).json(pendingConnections);
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    res.status(500).json({ error: error.message });
  }
};

// Mark connection as completed
export const completeConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const currentUser = req.user;

    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    // Check if user is part of the connection
    const isPartOfConnection =
      connection.helperUserId.toString() === currentUser._id.toString() ||
      connection.seekerUserId.toString() === currentUser._id.toString();

    if (!isPartOfConnection) {
      return res
        .status(403)
        .json({ message: "You are not part of this connection" });
    }

    if (connection.status !== "accepted") {
      return res.status(400).json({
        message: "Only accepted connections can be marked as completed",
      });
    }

    connection.status = "completed";
    connection.completedAt = new Date();
    await connection.save();

    // Check if there's a held payment and auto-release it
    const payment = await Payment.findOne({
      connectionId,
      status: "held",
    });

    if (payment) {
      try {
        await releasePayment(payment.paymentIntentId);
        payment.status = "released";
        payment.releasedAt = new Date();
        await payment.save();
      } catch (paymentError) {
        console.error("Error auto-releasing payment:", paymentError);
        // Don't fail the connection completion if payment release fails
      }
    }

    await connection.populate([
      { path: "helperUserId", select: "name email" },
      { path: "seekerUserId", select: "name email" },
    ]);

    res.status(200).json({
      message: "Connection marked as completed",
      connection,
      paymentReleased: payment ? true : false,
    });
  } catch (error) {
    console.error("Error completing connection:", error);
    res.status(500).json({ error: error.message });
  }
};

// Cancel a connection
export const cancelConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const currentUser = req.user;

    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    // Check if user is part of the connection
    const isPartOfConnection =
      connection.helperUserId.toString() === currentUser._id.toString() ||
      connection.seekerUserId.toString() === currentUser._id.toString();

    if (!isPartOfConnection) {
      return res
        .status(403)
        .json({ message: "You are not part of this connection" });
    }

    connection.status = "cancelled";
    await connection.save();

    // Check if there's a held payment and auto-refund it
    const payment = await Payment.findOne({
      connectionId,
      status: "held",
    });

    if (payment) {
      try {
        await refundPayment(payment.paymentIntentId);
        payment.status = "refunded";
        payment.refundedAt = new Date();
        await payment.save();
      } catch (paymentError) {
        console.error("Error auto-refunding payment:", paymentError);
        // Don't fail the connection cancellation if refund fails
      }
    }

    res.status(200).json({
      message: "Connection cancelled",
      connection,
      paymentRefunded: payment ? true : false,
    });
  } catch (error) {
    console.error("Error cancelling connection:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get connection status for a specific companion
export const getConnectionStatus = async (req, res) => {
  try {
    const { companionRequestId, companionType, flight_iata, flight_date } =
      req.params;
    const currentUser = req.user;

    // Find the companion request to get the other user
    let companionRequest;
    if (companionType === "helper") {
      companionRequest = await HelperRequest.findById(companionRequestId);
    } else if (companionType === "seeker") {
      companionRequest = await HelpSeekerRequest.findById(companionRequestId);
    } else {
      return res.status(400).json({ message: "Invalid companionType" });
    }

    if (!companionRequest) {
      return res.status(404).json({ message: "Companion request not found" });
    }

    // Get the other user
    let otherUser;
    if (companionRequest.userId) {
      otherUser = await User.findById(companionRequest.userId);
    } else if (companionRequest.email) {
      otherUser = await User.findOne({ email: companionRequest.email });
    }

    if (!otherUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find connection between current user and other user for this flight
    const connection = await Connection.findOne({
      $or: [
        {
          helperUserId: currentUser._id,
          seekerUserId: otherUser._id,
          flight_iata,
          flight_date: new Date(flight_date),
        },
        {
          helperUserId: otherUser._id,
          seekerUserId: currentUser._id,
          flight_iata,
          flight_date: new Date(flight_date),
        },
      ],
    })
      .populate("helperUserId", "name email")
      .populate("seekerUserId", "name email");

    if (!connection) {
      return res.status(200).json({ status: "none", connection: null });
    }

    res.status(200).json({ status: connection.status, connection });
  } catch (error) {
    console.error("Error getting connection status:", error);
    res.status(500).json({ error: error.message });
  }
};
