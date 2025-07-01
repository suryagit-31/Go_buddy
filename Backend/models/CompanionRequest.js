import mongoose from "mongoose";

const companionRequestSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      default: "user31",
    },
    flight_date: {
      type: Date,
      required: true,
    },
    flight_iata: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },

    name: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
      required: true,
      min: 18,
    },

    languages: {
      type: String,
      required: true,
    },

    phonenumber: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },

    seatNumber: {
      type: String,
    },

    description: {
      type: String,
    },

    passenger_role: {
      type: String,
      required: true,
      enum: ["helper", "seeker"],
    },

    isPaidHelper: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const CompanionRequest = mongoose.model(
  "CompanionRequest",
  companionRequestSchema,
  "Companions"
);

export default CompanionRequest;
