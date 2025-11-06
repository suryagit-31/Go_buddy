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

// Create Stripe customer
export const createCustomer = async (email, name, userId) => {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        userId: userId.toString(),
      },
    });
    return customer;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
};

// Create subscription
export const createSubscription = async (customerId, priceId) => {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      payment_settings: {
        save_default_payment_method: "on_subscription",
        payment_method_types: ["card"],
      },
      expand: ["latest_invoice.payment_intent"],
    });

    // If payment_intent is not expanded, retrieve the invoice separately
    if (
      subscription.latest_invoice &&
      (!subscription.latest_invoice.payment_intent ||
        typeof subscription.latest_invoice.payment_intent === "string")
    ) {
      const invoice = await stripe.invoices.retrieve(
        subscription.latest_invoice.id,
        {
          expand: ["payment_intent"],
        }
      );
      subscription.latest_invoice = invoice;
    }

    return subscription;
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw error;
  }
};

// Cancel subscription
export const cancelSubscription = async (subscriptionId) => {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);
    return subscription;
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    throw error;
  }
};

// Get subscription
export const getSubscription = async (subscriptionId) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.error("Error retrieving subscription:", error);
    throw error;
  }
};

// Create Stripe Checkout Session for subscription
export const createSubscriptionCheckoutSession = async (
  customerId,
  priceId,
  userId,
  successUrl,
  cancelUrl
) => {
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: userId.toString(),
      },
      subscription_data: {
        metadata: {
          userId: userId.toString(),
        },
      },
    });
    return session;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
};

export default stripe;
