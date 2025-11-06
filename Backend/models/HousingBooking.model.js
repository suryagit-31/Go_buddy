import mongoose from "mongoose";

const housingBookingSchema = new mongoose.Schema(
  {
    housingListingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HousingListing",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companionRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompanionRequest",
      // Optional - links booking to a flight companion request
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    message: {
      type: String,
      trim: true,
    },
    // Store contact information at time of booking
    guestName: {
      type: String,
      required: true,
    },
    guestEmail: {
      type: String,
      required: true,
    },
    guestPhone: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
housingBookingSchema.index({ housingListingId: 1 });
housingBookingSchema.index({ userId: 1 });
housingBookingSchema.index({ companionRequestId: 1 });
housingBookingSchema.index({ status: 1 });
housingBookingSchema.index({ checkInDate: 1, checkOutDate: 1 });

// Ensure check-out date is after check-in date
housingBookingSchema.pre("save", function (next) {
  if (this.checkOutDate <= this.checkInDate) {
    return next(new Error("Check-out date must be after check-in date"));
  }
  next();
});

const HousingBooking = mongoose.model("HousingBooking", housingBookingSchema);

export default HousingBooking;
