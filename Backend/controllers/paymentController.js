import Payment from "../models/Payment.model.js";
import Connection from "../models/Connection.model.js";
import { HelperRequest } from "../models/Helper.model.js";
import {
  createPaymentIntent,
  confirmAndHoldPayment,
  releasePayment,
  refundPayment,
  getPaymentIntent,
} from "../services/stripeService.js";

/**
 * Initialize payment for a connection (when accepting paid helper)
 */
export const initializePayment = async (req, res) => {
  try {
    const { connectionId } = req.body;
    const currentUser = req.user;

    // Find connection
    const connection = await Connection.findById(connectionId)
      .populate("helperRequestId")
      .populate("seekerRequestId");

    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    // Check if user is the seeker
    if (connection.seekerUserId.toString() !== currentUser._id.toString()) {
      return res.status(403).json({
        message: "Only the seeker can initialize payment",
      });
    }

    // Check if connection is accepted
    if (connection.status !== "accepted") {
      return res.status(400).json({
        message: "Connection must be accepted before payment",
      });
    }

    // Check if helper is paid
    const helperRequest = await HelperRequest.findById(
      connection.helperRequestId
    );
    if (
      !helperRequest ||
      !helperRequest.isPaidHelper ||
      !helperRequest.helperPrice
    ) {
      return res.status(400).json({
        message: "This helper does not require payment",
      });
    }

    // Check if payment already exists
    const existingPayment = await Payment.findOne({ connectionId });
    if (existingPayment) {
      return res.status(400).json({
        message: "Payment already initialized",
        payment: existingPayment,
      });
    }

    // Create payment intent
    const paymentIntent = await createPaymentIntent(
      helperRequest.helperPrice,
      "usd",
      {
        connectionId: connectionId.toString(),
        seekerUserId: currentUser._id.toString(),
        helperUserId: connection.helperUserId.toString(),
      }
    );

    // Create payment record
    const payment = new Payment({
      connectionId,
      seekerUserId: currentUser._id,
      helperUserId: connection.helperUserId,
      amount: helperRequest.helperPrice,
      currency: "usd",
      status: "pending",
      paymentIntentId: paymentIntent.id,
      metadata: {
        flight_iata: connection.flight_iata,
        flight_date: connection.flight_date.toString(),
      },
    });

    await payment.save();

    res.status(201).json({
      message: "Payment initialized",
      payment,
      clientSecret: paymentIntent.client_secret, // Frontend uses this to confirm payment
    });
  } catch (error) {
    console.error("Error initializing payment:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Confirm payment and hold in escrow
 */
export const confirmPayment = async (req, res) => {
  try {
    const { paymentId, paymentMethodId } = req.body;
    const currentUser = req.user;

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Check if user is the seeker
    if (payment.seekerUserId.toString() !== currentUser._id.toString()) {
      return res.status(403).json({
        message: "Only the seeker can confirm payment",
      });
    }

    if (payment.status !== "pending") {
      return res.status(400).json({
        message: `Payment is already ${payment.status}`,
      });
    }

    // Confirm payment with Stripe
    const paymentIntent = await confirmAndHoldPayment(
      payment.paymentIntentId,
      paymentMethodId
    );

    // Update payment status
    payment.status = "held";
    payment.paymentMethodId = paymentMethodId;
    payment.heldAt = new Date();
    payment.receiptUrl = paymentIntent.charges?.data[0]?.receipt_url || null;
    await payment.save();

    res.status(200).json({
      message: "Payment confirmed and held in escrow",
      payment,
    });
  } catch (error) {
    console.error("Error confirming payment:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Release payment from escrow (when connection is completed)
 */
export const releasePaymentToHelper = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const currentUser = req.user;

    const payment = await Payment.findById(paymentId).populate("connectionId");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Check if user is seeker or helper
    const isSeeker =
      payment.seekerUserId.toString() === currentUser._id.toString();
    const isHelper =
      payment.helperUserId.toString() === currentUser._id.toString();

    if (!isSeeker && !isHelper) {
      return res.status(403).json({
        message: "You are not authorized to release this payment",
      });
    }

    if (payment.status !== "held") {
      return res.status(400).json({
        message: `Payment cannot be released. Current status: ${payment.status}`,
      });
    }

    // Check if connection is completed
    const connection = await Connection.findById(payment.connectionId);
    if (connection.status !== "completed") {
      return res.status(400).json({
        message: "Connection must be completed before releasing payment",
      });
    }

    // Release payment
    const paymentIntent = await releasePayment(payment.paymentIntentId);

    // Update payment status
    payment.status = "released";
    payment.releasedAt = new Date();
    payment.receiptUrl =
      paymentIntent.charges?.data[0]?.receipt_url || payment.receiptUrl;
    await payment.save();

    res.status(200).json({
      message: "Payment released to helper",
      payment,
    });
  } catch (error) {
    console.error("Error releasing payment:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Refund payment (if connection is cancelled)
 */
export const refundPaymentToSeeker = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const currentUser = req.user;

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Check if user is seeker or helper
    const isSeeker =
      payment.seekerUserId.toString() === currentUser._id.toString();
    const isHelper =
      payment.helperUserId.toString() === currentUser._id.toString();

    if (!isSeeker && !isHelper) {
      return res.status(403).json({
        message: "You are not authorized to refund this payment",
      });
    }

    if (payment.status !== "held") {
      return res.status(400).json({
        message: `Payment cannot be refunded. Current status: ${payment.status}`,
      });
    }

    // Refund payment
    const refund = await refundPayment(payment.paymentIntentId);

    // Update payment status
    payment.status = "refunded";
    payment.refundedAt = new Date();
    await payment.save();

    res.status(200).json({
      message: "Payment refunded to seeker",
      payment,
      refund,
    });
  } catch (error) {
    console.error("Error refunding payment:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get payment history for current user
 */
export const getPaymentHistory = async (req, res) => {
  try {
    const currentUser = req.user;
    const { status } = req.query; // Optional filter

    const query = {
      $or: [
        { seekerUserId: currentUser._id },
        { helperUserId: currentUser._id },
      ],
    };

    if (status) {
      query.status = status;
    }

    const payments = await Payment.find(query)
      .populate("connectionId")
      .populate("seekerUserId", "name email")
      .populate("helperUserId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payment history:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get payment details
 */
export const getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const currentUser = req.user;

    const payment = await Payment.findById(paymentId)
      .populate("connectionId")
      .populate("seekerUserId", "name email")
      .populate("helperUserId", "name email");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Check if user is part of the payment
    const isSeeker =
      payment.seekerUserId._id.toString() === currentUser._id.toString();
    const isHelper =
      payment.helperUserId._id.toString() === currentUser._id.toString();

    if (!isSeeker && !isHelper) {
      return res.status(403).json({
        message: "You are not authorized to view this payment",
      });
    }

    // Get latest payment intent status from Stripe
    const paymentIntent = await getPaymentIntent(payment.paymentIntentId);

    res.status(200).json({
      payment,
      stripeStatus: paymentIntent.status,
      receiptUrl:
        payment.receiptUrl || paymentIntent.charges?.data[0]?.receipt_url,
    });
  } catch (error) {
    console.error("Error fetching payment details:", error);
    res.status(500).json({ error: error.message });
  }
};
