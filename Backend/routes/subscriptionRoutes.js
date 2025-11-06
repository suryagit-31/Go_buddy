import express from "express";
import {
  checkProStatus,
  createCheckoutSession,
  cancelUserSubscription,
  handleWebhook,
} from "../controllers/subscriptionController.js";
import { protected_Route } from "../middleware/auth.middleware.js";
 
const router = express.Router();

// Webhook route (no auth required, Stripe signs it)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

// All other routes require authentication
router.use(protected_Route);

router.get("/status", checkProStatus);
router.post("/checkout", createCheckoutSession);
router.post("/cancel", cancelUserSubscription);

export default router;
