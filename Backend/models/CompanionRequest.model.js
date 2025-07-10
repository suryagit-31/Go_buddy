import mongoose from "mongoose";

const companionRequestSchema = new mongoose.Schema(
  {
    flight_date: {
      type: Date,
      required: true,
    },
    flight_iata: {
      type: String,
      required: true,
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
      type: [String],
      required: true,
    },

    phonenumber: {
      type: String,
      required: true,
    },

    email: {
      type: String,
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

    helperPrice: {
      type: Number,
    },
    emergencyPhone: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default companionRequestSchema;
