import mongoose from "mongoose";

const companionRequestSchema = new mongoose.Schema({
  flightId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flight",
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, default: "" },
  status: {
    type: String,
    enum: ["pending", "accepted", "declined"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

const CompanionRequest = mongoose.model(
  "CompanionRequest",
  companionRequestSchema
);

export default CompanionRequest;
