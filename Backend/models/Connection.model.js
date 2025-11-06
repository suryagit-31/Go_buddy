import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema(
  {
    helperRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HelperRequest",
      required: function () {
        return this.helperType === "helper";
      },
    },
    seekerRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HelpSeekerRequest",
      required: function () {
        return this.helperType === "seeker";
      },
    },
    helperUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seekerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    flight_iata: {
      type: String,
      required: true,
    },
    flight_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
      default: "pending",
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requestedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    acceptedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
connectionSchema.index({ helperUserId: 1, seekerUserId: 1 });
connectionSchema.index({ flight_iata: 1, flight_date: 1 });
connectionSchema.index({ status: 1 });
connectionSchema.index({ requestedBy: 1, status: 1 });

const Connection = mongoose.model("Connection", connectionSchema);

export default Connection;
