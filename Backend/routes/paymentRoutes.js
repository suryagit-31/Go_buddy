import express from "express";
import {
  initializePayment,
  confirmPayment,
  releasePaymentToHelper,
  refundPaymentToSeeker,
  getPaymentHistory,
  getPaymentDetails, 
} from "../controllers/paymentController.js";
import { protected_Route } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(protected_Route);

router.post("/initialize", initializePayment);
router.post("/confirm", confirmPayment);
router.post("/release/:paymentId", releasePaymentToHelper);
router.post("/refund/:paymentId", refundPaymentToSeeker);
router.get("/history", getPaymentHistory);
router.get("/:paymentId", getPaymentDetails);

export default router;
