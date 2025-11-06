import HousingListing from "../models/HousingListing.model.js";
import HousingBooking from "../models/HousingBooking.model.js";
import User from "../models/User.model.js";

// Create a new housing listing
export const createHousingListing = async (req, res) => {
  try {
    const userId = req.user._id;
    const listingData = {
      ...req.body,
      userId,
    };

    // Use user's email as contact email if not provided
    if (!listingData.contactEmail && req.user.email) {
      listingData.contactEmail = req.user.email;
    }

    const listing = new HousingListing(listingData);
    await listing.save();

    // Populate user data
    await listing.populate("userId", "name email");

    res.status(201).json({
      message: "Housing listing created successfully",
      listing,
    });
  } catch (error) {
    console.error("Error creating housing listing:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all housing listings with search and filter
export const getHousingListings = async (req, res) => {
  try {
    const {
      state,
      city,
      zipCode,
      minRent,
      maxRent,
      helperType,
      isAvailable,
      search,
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build query
    const query = {};

    // Filter by availability (default to only available listings)
    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === "true";
    } else {
      query.isAvailable = true; // Default to only show available listings
    }

    // Location filters
    if (state) {
      query.state = new RegExp(state, "i");
    }
    if (city) {
      query.city = new RegExp(city, "i");
    }
    if (zipCode) {
      query.zipCode = zipCode;
    }

    // Rent range filter
    if (minRent || maxRent) {
      query.rentPerMonth = {};
      if (minRent) {
        query.rentPerMonth.$gte = Number(minRent);
      }
      if (maxRent) {
        query.rentPerMonth.$lte = Number(maxRent);
      }
    }

    // Helper type filter
    if (helperType) {
      query.helperType = helperType;
    }

    // Text search in description, city, state
    if (search) {
      query.$or = [
        { description: new RegExp(search, "i") },
        { city: new RegExp(search, "i") },
        { state: new RegExp(search, "i") },
      ];
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Execute query
    const listings = await HousingListing.find(query)
      .populate("userId", "name email")
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await HousingListing.countDocuments(query);

    res.status(200).json({
      listings,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error fetching housing listings:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get a single housing listing by ID
export const getHousingListingById = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await HousingListing.findById(id).populate(
      "userId",
      "name email phone city languages bio"
    );

    if (!listing) {
      return res.status(404).json({ message: "Housing listing not found" });
    }

    // Get booking count for this listing
    const bookingCount = await HousingBooking.countDocuments({
      housingListingId: id,
      status: { $in: ["pending", "confirmed"] },
    });

    res.status(200).json({
      listing,
      bookingCount,
    });
  } catch (error) {
    console.error("Error fetching housing listing:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update a housing listing
export const updateHousingListing = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const listing = await HousingListing.findById(id);

    if (!listing) {
      return res.status(404).json({ message: "Housing listing not found" });
    }

    // Check if user owns the listing
    if (listing.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You can only update your own listings" });
    }

    // Update listing
    Object.assign(listing, req.body);
    await listing.save();

    await listing.populate("userId", "name email");

    res.status(200).json({
      message: "Housing listing updated successfully",
      listing,
    });
  } catch (error) {
    console.error("Error updating housing listing:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a housing listing
export const deleteHousingListing = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const listing = await HousingListing.findById(id);

    if (!listing) {
      return res.status(404).json({ message: "Housing listing not found" });
    }

    // Check if user owns the listing
    if (listing.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You can only delete your own listings" });
    }

    // Check if there are active bookings
    const activeBookings = await HousingBooking.countDocuments({
      housingListingId: id,
      status: { $in: ["pending", "confirmed"] },
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        message:
          "Cannot delete listing with active bookings. Please cancel bookings first.",
      });
    }

    await HousingListing.findByIdAndDelete(id);

    res.status(200).json({ message: "Housing listing deleted successfully" });
  } catch (error) {
    console.error("Error deleting housing listing:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get user's own listings
export const getUserHousingListings = async (req, res) => {
  try {
    const userId = req.user._id;

    const listings = await HousingListing.find({ userId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ listings });
  } catch (error) {
    console.error("Error fetching user listings:", error);
    res.status(500).json({ error: error.message });
  }
};

// Create a housing booking
export const createHousingBooking = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      housingListingId,
      companionRequestId,
      checkInDate,
      checkOutDate,
      message,
    } = req.body;

    // Validate listing exists and is available
    const listing = await HousingListing.findById(housingListingId);
    if (!listing) {
      return res.status(404).json({ message: "Housing listing not found" });
    }

    if (!listing.isAvailable) {
      return res.status(400).json({ message: "This listing is not available" });
    }

    // Check for date conflicts with existing bookings
    const conflictingBookings = await HousingBooking.find({
      housingListingId,
      status: { $in: ["pending", "confirmed"] },
      $or: [
        {
          checkInDate: { $lte: new Date(checkOutDate) },
          checkOutDate: { $gte: new Date(checkInDate) },
        },
      ],
    });

    if (conflictingBookings.length > 0) {
      return res.status(400).json({
        message: "Dates conflict with existing bookings",
      });
    }

    // Calculate total amount based on rent and duration
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalAmount = (listing.rentPerMonth / 30) * nights; // Approximate daily rate

    // Get user info
    const user = await User.findById(userId);

    const bookingData = {
      housingListingId,
      userId,
      companionRequestId: companionRequestId || undefined,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalAmount,
      message,
      guestName: user.name,
      guestEmail: user.email,
      guestPhone: user.phone,
    };

    const booking = new HousingBooking(bookingData);
    await booking.save();

    await booking.populate([
      {
        path: "housingListingId",
        populate: { path: "userId", select: "name email" },
      },
      { path: "userId", select: "name email" },
      { path: "companionRequestId" },
    ]);

    res.status(201).json({
      message: "Housing booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Error creating housing booking:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get bookings for a housing listing (for listing owner)
export const getListingBookings = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Verify user owns the listing
    const listing = await HousingListing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: "Housing listing not found" });
    }

    if (listing.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You can only view bookings for your own listings" });
    }

    const bookings = await HousingBooking.find({ housingListingId: id })
      .populate("userId", "name email phone")
      .populate("companionRequestId")
      .sort({ createdAt: -1 });

    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching listing bookings:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get user's bookings
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id;

    const bookings = await HousingBooking.find({ userId })
      .populate({
        path: "housingListingId",
        populate: { path: "userId", select: "name email" },
      })
      .populate("companionRequestId")
      .sort({ createdAt: -1 });

    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update booking status (for listing owner to confirm/cancel)
export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const userId = req.user._id;

    const booking = await HousingBooking.findById(bookingId).populate(
      "housingListingId"
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Verify user owns the listing
    if (booking.housingListingId.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({
          message: "You can only update bookings for your own listings",
        });
    }

    // Validate status
    if (!["pending", "confirmed", "cancelled", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    booking.status = status;
    await booking.save();

    await booking.populate([
      {
        path: "housingListingId",
        populate: { path: "userId", select: "name email" },
      },
      { path: "userId", select: "name email" },
    ]);

    res.status(200).json({
      message: "Booking status updated successfully",
      booking,
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ error: error.message });
  }
};

// Cancel booking (for guest)
export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user._id;

    const booking = await HousingBooking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Verify user owns the booking
    if (booking.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You can only cancel your own bookings" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get housing listings connected to a companion request
export const getHousingForCompanion = async (req, res) => {
  try {
    const { companionRequestId } = req.params;

    // Find bookings linked to this companion request
    const bookings = await HousingBooking.find({
      companionRequestId,
      status: { $in: ["pending", "confirmed"] },
    }).populate({
      path: "housingListingId",
      populate: { path: "userId", select: "name email" },
    });

    const listings = bookings.map((booking) => booking.housingListingId);

    res.status(200).json({ listings });
  } catch (error) {
    console.error("Error fetching housing for companion:", error);
    res.status(500).json({ error: error.message });
  }
};
