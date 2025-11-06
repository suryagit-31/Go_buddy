import mongoose from "mongoose";

const housingListingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    zipCode: {
      type: String,
      required: true,
      trim: true,
    },
    rentPerMonth: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    contactEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    helperType: {
      type: String,
      required: true,
      enum: ["Volunteer", "Paid", "Student"],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    images: {
      type: [String],
      default: [],
    },
    amenities: {
      type: [String],
      default: [],
    },
    numberOfBedrooms: {
      type: Number,
      min: 1,
    },
    numberOfBathrooms: {
      type: Number,
      min: 0,
    },
    availableFrom: {
      type: Date,
    },
    availableUntil: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient searching
housingListingSchema.index({ state: 1, city: 1 });
housingListingSchema.index({ zipCode: 1 });
housingListingSchema.index({ rentPerMonth: 1 });
housingListingSchema.index({ isAvailable: 1 });
housingListingSchema.index({ userId: 1 });

const HousingListing = mongoose.model("HousingListing", housingListingSchema);

export default HousingListing;
