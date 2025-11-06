import User from "../models/User.model.js";
import stripe, {
  createCustomer,
  createSubscription,
  createSubscriptionCheckoutSession,
  cancelSubscription,
  getSubscription,
} from "../services/subscriptionService.js";

const PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID;

if (!PRO_PRICE_ID) {
  console.warn("⚠️  WARNING: STRIPE_PRO_PRICE_ID is not set in .env file!");
  console.warn(
    "   Please create a product and price in Stripe Dashboard and add the price ID to your .env file."
  );
}

// Map Stripe subscription status to our internal status
const mapStripeStatus = (stripeStatus) => {
  const statusMap = {
    active: "active",
    trialing: "trialing",
    past_due: "past_due",
    cancelled: "cancelled",
    incomplete: "incomplete",
    incomplete_expired: "cancelled",
    unpaid: "cancelled",
  };
  return statusMap[stripeStatus] || "incomplete";
};

// Check if user has Pro
export const checkProStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    console.log("Checking Pro status for user:", user._id);
    console.log(
      "Current subscription:",
      JSON.stringify(user.subscription, null, 2)
    );

    // Always verify with Stripe if user has a subscription ID
    if (user.subscription?.stripeSubscriptionId) {
      try {
        console.log(
          "Verifying subscription with Stripe:",
          user.subscription.stripeSubscriptionId
        );
        const subscription = await stripe.subscriptions.retrieve(
          user.subscription.stripeSubscriptionId,
          {
            expand: ["latest_invoice", "latest_invoice.payment_intent"],
          }
        );

        console.log("Stripe subscription status:", subscription.status);
        console.log("Stripe subscription details:", {
          id: subscription.id,
          status: subscription.status,
          current_period_end: subscription.current_period_end,
          latest_invoice: subscription.latest_invoice?.id,
        });

        // ALWAYS use Stripe's subscription status as the source of truth
        let finalStatus = subscription.status;

        console.log(
          `📊 Stripe shows status: "${subscription.status}" - syncing to database`
        );

        // If Stripe shows "active", use it directly
        if (subscription.status === "active") {
          console.log("✅ Stripe subscription is ACTIVE - updating database");
          finalStatus = "active";
        }
        // Also check recent checkout sessions for this customer if subscription is incomplete
        else if (
          user.subscription?.stripeCustomerId &&
          subscription.status === "incomplete"
        ) {
          try {
            const checkoutSessions = await stripe.checkout.sessions.list({
              customer: user.subscription.stripeCustomerId,
              limit: 10,
            });

            console.log(
              "Recent checkout sessions:",
              checkoutSessions.data.length
            );

            // Log all sessions for debugging
            checkoutSessions.data.forEach((s, idx) => {
              console.log(`Session ${idx + 1}:`, {
                id: s.id,
                status: s.status,
                payment_status: s.payment_status,
                subscription: s.subscription,
                mode: s.mode,
                created: new Date(s.created * 1000).toISOString(),
              });
            });

            // Find completed session - check by subscription ID first, then by payment status
            let completedSession = checkoutSessions.data.find(
              (s) =>
                s.status === "complete" &&
                s.subscription === subscription.id &&
                s.payment_status === "paid"
            );

            // If not found, try finding any paid session
            if (!completedSession) {
              completedSession = checkoutSessions.data.find(
                (s) => s.status === "complete" && s.payment_status === "paid"
              );
            }

            if (completedSession) {
              console.log(
                "✅ Found completed checkout session:",
                completedSession.id
              );
              console.log(
                "   Payment status:",
                completedSession.payment_status
              );
              console.log("   Subscription ID:", completedSession.subscription);

              // If checkout is complete and paid, update status
              if (completedSession.payment_status === "paid") {
                console.log(
                  "✅ Checkout session shows payment was successful - activating subscription"
                );
                finalStatus = "active";

                // Try to finalize the invoice if it's still open
                if (subscription.latest_invoice) {
                  const invoiceId =
                    typeof subscription.latest_invoice === "string"
                      ? subscription.latest_invoice
                      : subscription.latest_invoice.id;

                  try {
                    const invoice = await stripe.invoices.retrieve(invoiceId);
                    if (invoice.status === "open") {
                      console.log(
                        "⚠️ Invoice is still open, attempting to finalize..."
                      );
                      // Try to pay the invoice using the payment method from checkout
                      const paidInvoice = await stripe.invoices.pay(invoiceId);
                      console.log("✅ Invoice finalized:", paidInvoice.status);
                    }
                  } catch (invoiceError) {
                    console.error(
                      "Error finalizing invoice:",
                      invoiceError.message
                    );
                  }
                }
              }
            } else {
              console.log("⚠️ No completed paid checkout session found");
            }
          } catch (sessionError) {
            console.error(
              "Error checking checkout sessions:",
              sessionError.message
            );
          }
        }
        if (
          subscription.status === "incomplete" &&
          subscription.latest_invoice
        ) {
          const invoice =
            typeof subscription.latest_invoice === "string"
              ? await stripe.invoices.retrieve(subscription.latest_invoice, {
                  expand: ["payment_intent", "charge"],
                })
              : subscription.latest_invoice;

          console.log("Latest invoice status:", invoice.status);
          console.log("Invoice details:", {
            id: invoice.id,
            status: invoice.status,
            payment_intent: invoice.payment_intent?.id || "none",
            payment_intent_status: invoice.payment_intent?.status || "none",
            charge: invoice.charge?.id || "none",
            charge_status: invoice.charge?.status || "none",
          });

          // Check payment intent status
          if (invoice.payment_intent) {
            const paymentIntent =
              typeof invoice.payment_intent === "string"
                ? await stripe.paymentIntents.retrieve(invoice.payment_intent)
                : invoice.payment_intent;

            console.log("Payment Intent details:", {
              id: paymentIntent.id,
              status: paymentIntent.status,
              amount: paymentIntent.amount,
              currency: paymentIntent.currency,
            });

            // If payment intent succeeded, update subscription
            if (paymentIntent.status === "succeeded") {
              console.log(
                "✅ Payment intent succeeded, updating subscription to active"
              );
              finalStatus = "active";
            } else if (paymentIntent.status === "requires_capture") {
              console.log(
                "✅ Payment requires capture, updating subscription to active"
              );
              finalStatus = "active";
            } else {
              console.log(
                `⚠️ Payment intent status: ${paymentIntent.status} - payment not completed`
              );
            }
          }

          // If invoice is paid, subscription should be active
          if (invoice.status === "paid") {
            console.log("✅ Invoice is paid, updating subscription to active");
            finalStatus = "active";
          } else if (invoice.status === "open" && invoice.payment_intent) {
            console.log(
              "⚠️ Invoice is open but has payment intent - checking payment status"
            );
          } else if (invoice.status === "open") {
            console.log("❌ Invoice is open - payment not completed");
            console.log(
              "   This means the payment was not successfully processed"
            );
            console.log(
              "   User may need to complete payment or use a different payment method"
            );
          }
        }

        // Initialize subscription object if it doesn't exist
        if (!user.subscription) {
          user.subscription = {};
        }

        // Update user subscription based on Stripe status
        const mappedStatus = mapStripeStatus(finalStatus);
        const wasActive = user.subscription.status === "active";
        const isNowActive = mappedStatus === "active";

        console.log(
          `🔄 Updating subscription: ${user.subscription.status} → ${mappedStatus}`
        );
        user.subscription.status = mappedStatus;

        // Set plan to "pro" if subscription is active or trialing
        if (mappedStatus === "active" || mappedStatus === "trialing") {
          user.subscription.plan = "pro";
          console.log("✅ Plan set to PRO");
        } else if (mappedStatus === "cancelled") {
          user.subscription.plan = "free";
          console.log("⚠️ Plan set to FREE (cancelled)");
        }

        // IMPORTANT: If Stripe shows "active", always set to pro regardless of previous status
        if (subscription.status === "active") {
          user.subscription.plan = "pro";
          user.subscription.status = "active";
          console.log(
            "✅ Force-updated to PRO and ACTIVE based on Stripe status"
          );
        }

        // Update subscription IDs if not set
        if (!user.subscription.stripeSubscriptionId) {
          user.subscription.stripeSubscriptionId = subscription.id;
        }
        if (!user.subscription.stripeCustomerId && subscription.customer) {
          user.subscription.stripeCustomerId = subscription.customer;
        }

        // Update period end date - always sync from Stripe
        if (subscription.current_period_end) {
          const periodEnd = new Date(subscription.current_period_end * 1000);
          if (!isNaN(periodEnd.getTime())) {
            user.subscription.currentPeriodEnd = periodEnd;
            console.log(
              `📅 Period end date set to: ${periodEnd.toISOString()}`
            );
          }
        } else if (subscription.status === "active") {
          // If active but no period_end, set a default (1 month from now)
          const defaultPeriodEnd = new Date();
          defaultPeriodEnd.setMonth(defaultPeriodEnd.getMonth() + 1);
          user.subscription.currentPeriodEnd = defaultPeriodEnd;
          console.log(
            `📅 Set default period end date: ${defaultPeriodEnd.toISOString()}`
          );
        }

        // If we detected payment via checkout but Stripe still shows incomplete,
        // update the subscription status in Stripe
        if (finalStatus === "active" && subscription.status === "incomplete") {
          console.log(
            "⚠️ Payment detected but subscription still incomplete in Stripe"
          );
          console.log(
            "   This may be a timing issue - subscription will update when Stripe processes payment"
          );
          console.log("   Setting status to active in our database anyway");
        }

        // Always save to ensure subscription is synced
        await user.save();
        console.log("✅ User subscription synced with Stripe");
        console.log(
          `   Final status: ${mappedStatus}, Plan: ${user.subscription.plan}`
        );
        console.log(
          `   isPro check: plan=${user.subscription.plan}, status=${user.subscription.status}`
        );
      } catch (stripeError) {
        console.error("Error verifying subscription with Stripe:", stripeError);
        console.error("Stripe error details:", {
          message: stripeError.message,
          type: stripeError.type,
          code: stripeError.code,
        });
        // Continue with existing status if Stripe check fails
      }
    } else {
      console.log("No Stripe subscription ID found for user");
    }

    // Re-fetch user to get latest subscription status
    const updatedUser = await User.findById(req.user._id);

    // Check if user is Pro: plan must be "pro" AND status must be "active"
    // BUT: If plan is "pro" and we have a subscription ID, also check Stripe directly
    let isPro =
      updatedUser.subscription?.plan === "pro" &&
      updatedUser.subscription?.status === "active";

    // If plan is pro but status is incomplete, check if payment was actually completed
    if (
      updatedUser.subscription?.plan === "pro" &&
      updatedUser.subscription?.status === "incomplete" &&
      updatedUser.subscription?.stripeSubscriptionId
    ) {
      // Check if we can verify payment was completed via checkout session
      try {
        const checkoutSessions = await stripe.checkout.sessions.list({
          customer: updatedUser.subscription.stripeCustomerId,
          limit: 5,
        });
        const paidSession = checkoutSessions.data.find(
          (s) => s.status === "complete" && s.payment_status === "paid"
        );
        if (paidSession) {
          console.log("✅ Found paid checkout session - granting Pro access");
          isPro = true;
          // Update status to active
          updatedUser.subscription.status = "active";
          await updatedUser.save();
        }
      } catch (error) {
        console.error("Error checking checkout for Pro status:", error.message);
      }
    }

    console.log("Final Pro status check:", {
      isPro,
      plan: updatedUser.subscription?.plan,
      status: updatedUser.subscription?.status,
    });

    res.json({
      isPro,
      plan: updatedUser.subscription?.plan || "free",
      status: updatedUser.subscription?.status || "free",
      currentPeriodEnd: updatedUser.subscription?.currentPeriodEnd,
      stripeSubscriptionId: updatedUser.subscription?.stripeSubscriptionId,
    });
  } catch (error) {
    console.error("Error in checkProStatus:", error);
    res.status(500).json({ error: error.message });
  }
};

// Create checkout session
export const createCheckoutSession = async (req, res) => {
  try {
    if (!PRO_PRICE_ID) {
      return res.status(500).json({
        error:
          "Stripe price ID not configured. Please set STRIPE_PRO_PRICE_ID in .env file.",
        setupRequired: true,
      });
    }

    const user = await User.findById(req.user._id);

    // Get frontend URL from request origin or env variable
    const frontendOrigin =
      req.headers.origin ||
      req.headers.referer?.split("/").slice(0, 3).join("/");
    const baseUrl =
      process.env.FRONTEND_URL || frontendOrigin || "http://localhost:3000";

    console.log("Creating checkout session with URLs:", {
      baseUrl,
      origin: req.headers.origin,
      referer: req.headers.referer,
    });

    // Create or get Stripe customer
    let customerId = user.subscription?.stripeCustomerId;
    if (!customerId) {
      const customer = await createCustomer(user.email, user.name, user._id);
      customerId = customer.id;
      if (!user.subscription) {
        user.subscription = {};
      }
      user.subscription.stripeCustomerId = customerId;
      await user.save();
    }

    // Create Stripe Checkout Session
    const session = await createSubscriptionCheckoutSession(
      customerId,
      PRO_PRICE_ID,
      user._id,
      `${baseUrl}/buddypro?success=true`,
      `${baseUrl}/buddypro?canceled=true`
    );

    res.json({
      sessionId: session.id,
      url: session.url, // This is the Stripe Checkout URL
    });
  } catch (error) {
    console.error("Error creating checkout:", error);
    console.error("Error details:", {
      message: error.message,
      type: error.type,
      code: error.code,
      stack: error.stack,
    });
    res.status(500).json({
      error: error.message || "Failed to create subscription",
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// Cancel subscription
export const cancelUserSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.subscription?.stripeSubscriptionId) {
      return res.status(400).json({ message: "No active subscription" });
    }

    await cancelSubscription(user.subscription.stripeSubscriptionId);

    if (!user.subscription) {
      user.subscription = {};
    }
    user.subscription.status = "cancelled";
    user.subscription.cancelAtPeriodEnd = true;
    await user.save();

    res.json({ message: "Subscription cancelled" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Webhook handler
export const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        // Handle successful checkout
        const session = event.data.object;
        console.log("📦 Checkout session completed:", {
          sessionId: session.id,
          subscriptionId: session.subscription,
          customerId: session.customer,
          metadata: session.metadata,
        });

        const userId = session.metadata?.userId;
        let user = null;

        // Try to find user by userId from metadata
        if (userId) {
          user = await User.findById(userId);
          console.log(`Found user by userId: ${userId}`, user ? "✅" : "❌");
        }

        // Fallback: find user by customer ID if userId not found
        if (!user && session.customer) {
          user = await User.findOne({
            "subscription.stripeCustomerId": session.customer,
          });
          console.log(
            `Found user by customerId: ${session.customer}`,
            user ? "✅" : "❌"
          );
        }

        if (user && session.subscription) {
          try {
            const subscription = await stripe.subscriptions.retrieve(
              session.subscription
            );

            console.log("Retrieved subscription from Stripe:", {
              id: subscription.id,
              status: subscription.status,
              customer: subscription.customer,
            });

            if (!user.subscription) {
              user.subscription = {};
            }
            user.subscription.status = mapStripeStatus(subscription.status);
            user.subscription.plan = "pro";
            user.subscription.stripeSubscriptionId = subscription.id;
            user.subscription.stripeCustomerId = subscription.customer;

            if (subscription.current_period_end) {
              const periodEnd = new Date(
                subscription.current_period_end * 1000
              );
              if (!isNaN(periodEnd.getTime())) {
                user.subscription.currentPeriodEnd = periodEnd;
              }
            }

            // Ensure plan is set to "pro"
            user.subscription.plan = "pro";

            await user.save();
            console.log(`✅ Subscription activated for user ${user._id}`);
            console.log(
              `   Plan: ${user.subscription.plan}, Status: ${user.subscription.status}`
            );
            console.log(
              `   Subscription ID: ${user.subscription.stripeSubscriptionId}`
            );
          } catch (error) {
            console.error(
              "Error processing checkout.session.completed:",
              error
            );
          }
        } else {
          console.warn("⚠️ Could not find user for checkout session:", {
            userId,
            customerId: session.customer,
            subscriptionId: session.subscription,
          });
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        // Find user by Stripe customer ID
        const user = await User.findOne({
          "subscription.stripeCustomerId": customerId,
        });

        if (user) {
          if (!user.subscription) {
            user.subscription = {};
          }
          user.subscription.status = mapStripeStatus(subscription.status);
          user.subscription.plan = "pro";
          user.subscription.stripeSubscriptionId = subscription.id;

          // Only set currentPeriodEnd if it exists and is valid
          if (subscription.current_period_end) {
            const periodEnd = new Date(subscription.current_period_end * 1000);
            if (!isNaN(periodEnd.getTime())) {
              user.subscription.currentPeriodEnd = periodEnd;
            }
          }

          await user.save();
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        const user = await User.findOne({
          "subscription.stripeCustomerId": customerId,
        });

        if (user) {
          if (!user.subscription) {
            user.subscription = {};
          }
          user.subscription.status = "cancelled";
          user.subscription.plan = "free";
          await user.save();
        }
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
};
