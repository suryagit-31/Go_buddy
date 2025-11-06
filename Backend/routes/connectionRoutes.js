import express from "express";
import {
  requestConnection,
  acceptConnection,
  rejectConnection,
  getUserConnections,
  getPendingRequests,
  completeConnection,
  cancelConnection,
  getConnectionStatus,
} from "../controllers/connectioncontroller.js";
import { protected_Route } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(protected_Route);

// Request a connection with a companion
router.post("/request", requestConnection);

// Accept a connection request
router.put("/:connectionId/accept", acceptConnection);

// Reject a connection request
router.put("/:connectionId/reject", rejectConnection);

// Cancel a connection
router.put("/:connectionId/cancel", cancelConnection);

// Mark connection as completed
router.put("/:connectionId/complete", completeConnection);

// Get all connections for current user (with optional status filter)
router.get("/", getUserConnections);

// Get pending connection requests received by user
router.get("/pending", getPendingRequests);

// Get connection status for a specific companion
router.get(
  "/status/:companionType/:companionRequestId/:flight_iata/:flight_date",
  getConnectionStatus
);

export default router;
