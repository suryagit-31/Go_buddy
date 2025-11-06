import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    connectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Connection",
      required: true,
    },
    seekerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    helperUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "usd",
    },
    status: {
      type: String,
      enum: ["pending", "held", "released", "refunded", "failed"],
      default: "pending",
    },
    paymentIntentId: {
      type: String, // Stripe Payment Intent ID
      required: true,
    },
    paymentMethodId: {
      type: String, // Stripe Payment Method ID
    },
    receiptUrl: {
      type: String, // Stripe receipt URL
    },
    heldAt: {
      type: Date, // When payment was held in escrow
    },
    releasedAt: {
      type: Date, // When payment was released to helper
    },
    refundedAt: {
      type: Date, // When payment was refunded
    },
    metadata: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
paymentSchema.index({ connectionId: 1 });
paymentSchema.index({ seekerUserId: 1 });
paymentSchema.index({ helperUserId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ paymentIntentId: 1 });

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
