import express from "express";
import CompanionRequest from "../models/CompanionRequest.model.js";
import {
  createCompanion,
  getOtherCompanions,
  getUserBookings,
  deleteBooking,
} from "../controllers/companioncontroller.js";
import { protected_Route } from "../middleware/auth.middleware.js";
import { optionalAuth } from "../middleware/optionalAuth.middleware.js";

const router = express.Router();

// Create a companion request (requires authentication)
router.post("/", protected_Route, createCompanion);

// Find companions for a specific flight
router.get("/flight/:flightId", async (req, res, next) => {
  try {
    const companions = await CompanionRequest.find({
      flightId: req.params.flightId,
      status: "accepted",
    }).populate("userId");

    res.json(companions);
  } catch (error) {
    next(error);
  }
});

// Get companions by flight meta (optional auth to filter out own requests)
router.get(
  "/by-flight/:flight_iata/:flight_date",
  optionalAuth,
  getOtherCompanions
);

// Get bookings for a user (email) - requires authentication
router.get("/by-user/:UserMail", protected_Route, getUserBookings);

// Cancel a booking by id - requires authentication
router.delete("/:id", protected_Route, deleteBooking);

export default router;
