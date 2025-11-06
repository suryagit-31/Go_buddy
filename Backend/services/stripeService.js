import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

// Validate Stripe key format
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
}
if (
  !stripeSecretKey.startsWith("sk_test_") &&
  !stripeSecretKey.startsWith("sk_live_")
) {
  throw new Error(
    `Invalid Stripe secret key format. Key should start with 'sk_test_' or 'sk_live_', but got: ${stripeSecretKey.substring(
      0,
      10
    )}...`
  );
}

const stripe = new Stripe(stripeSecretKey);

/**
 * Create a payment intent for escrow
 */
export const createPaymentIntent = async (
  amount,
  currency = "usd",
  metadata = {}
) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata,
      capture_method: "manual", // Hold payment until we release it
    });

    return paymentIntent;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error;
  }
};

/**
 * Confirm and hold payment (escrow)
 */
export const confirmAndHoldPayment = async (
  paymentIntentId,
  paymentMethodId
) => {
  try {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,
    });

    return paymentIntent;
  } catch (error) {
    console.error("Error confirming payment:", error);
    throw error;
  }
};

/**
 * Release payment from escrow to helper
 */
export const releasePayment = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error("Error releasing payment:", error);
    throw error;
  }
};

/**
 * Refund payment
 */
export const refundPayment = async (paymentIntentId, amount = null) => {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined, // Partial refund if amount specified
    });
    return refund;
  } catch (error) {
    console.error("Error refunding payment:", error);
    throw error;
  }
};

/**
 * Get payment intent details
 */
export const getPaymentIntent = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error("Error retrieving payment intent:", error);
    throw error;
  }
};

export default stripe;
