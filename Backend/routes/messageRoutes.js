import express from "express";
import {
  getMessages,
  sendMessage,
  uploadFile,
  markAsRead,
  searchMessages,
  getUnreadCount,
} from "../controllers/messageController.js";
import { protected_Route } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

// Send text message
router.post("/", protected_Route, sendMessage);

// Upload file/image
router.post("/upload", protected_Route, upload.single("file"), uploadFile);

// Mark messages as read
router.put("/read", protected_Route, markAsRead);

// Get unread count
router.get("/unread/count", protected_Route, getUnreadCount);

// Search messages (must come before /:connectionId)
router.get("/search/:connectionId", protected_Route, searchMessages);

// Get messages for a connection (catch-all, must come last)
router.get("/:connectionId", protected_Route, getMessages);

export default router;
