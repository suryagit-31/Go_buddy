import express from "express";
import {
  createHousingListing,
  getHousingListings,
  getHousingListingById,
  updateHousingListing,
  deleteHousingListing,
  getUserHousingListings,
  createHousingBooking,
  getListingBookings,
  getUserBookings,
  updateBookingStatus,
  cancelBooking,
  getHousingForCompanion,
} from "../controllers/housingController.js";
import { protected_Route } from "../middleware/auth.middleware.js";
import { optionalAuth } from "../middleware/optionalAuth.middleware.js";

const router = express.Router();

// Public routes (optional auth for filtering)
// Get all housing listings with search and filter
router.get("/", optionalAuth, getHousingListings);

// Protected routes (require authentication)
// Create a new housing listing
router.post("/", protected_Route, createHousingListing);

// Get user's own listings (must come before /:id route)
router.get("/user/my-listings", protected_Route, getUserHousingListings);

// Booking routes (must come before /:id route)
// Get user's bookings
router.get("/bookings/my-bookings", protected_Route, getUserBookings);

// Create a housing booking
router.post("/bookings", protected_Route, createHousingBooking);

// Update booking status (listing owner)
router.patch(
  "/bookings/:bookingId/status",
  protected_Route,
  updateBookingStatus
);

// Cancel booking (guest)
router.delete("/bookings/:bookingId", protected_Route, cancelBooking);

// Get housing listings connected to a companion request (must come before /:id route)
router.get(
  "/companion/:companionRequestId",
  protected_Route,
  getHousingForCompanion
);

// Get bookings for a specific listing (listing owner only) - must come before /:id
router.get("/:id/bookings", protected_Route, getListingBookings);

// Get a single housing listing by ID (must come after specific routes)
router.get("/:id", optionalAuth, getHousingListingById);

// Update a housing listing
router.put("/:id", protected_Route, updateHousingListing);

// Delete a housing listing
router.delete("/:id", protected_Route, deleteHousingListing);

export default router;
