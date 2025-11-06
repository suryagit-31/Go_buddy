import express from "express";
import {
  getNotifications,
  markNotificationAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification,
} from "../controllers/notificationController.js";
import { protected_Route } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protected_Route); // All routes require authentication

// Get all notifications
router.get("/", getNotifications);

// Get unread count
router.get("/unread/count", getUnreadCount);

// Mark notification as read
router.put("/:notificationId/read", markNotificationAsRead);

// Mark all as read
router.put("/read/all", markAllAsRead);

// Delete notification
router.delete("/:notificationId", deleteNotification);

export default router;
