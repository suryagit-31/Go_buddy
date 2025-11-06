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

// Get messages for a connection
router.get("/:connectionId", protected_Route, getMessages);

// Send text message
router.post("/", protected_Route, sendMessage);

// Upload file/image
router.post("/upload", protected_Route, upload.single("file"), uploadFile);

// Mark messages as read
router.put("/read", protected_Route, markAsRead);

// Search messages
router.get("/search/:connectionId", protected_Route, searchMessages);

// Get unread count
router.get("/unread/count", protected_Route, getUnreadCount);

export default router;

