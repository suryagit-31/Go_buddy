import Message from "../models/Message.model.js";
import Connection from "../models/Connection.model.js";
import User from "../models/User.model.js";
import {
  uploadToCloudinary,
  uploadImageToCloudinary,
  generateFileName,
} from "../services/cloudinaryService.js";
import { getIO } from "../socket/socketServer.js";

// Get messages for a connection
export const getMessages = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const userId = req.user._id;
    const { page = 1, limit = 50 } = req.query;

    // Verify user is part of this connection
    const connection = await Connection.findOne({
      _id: connectionId,
      $or: [{ helperUserId: userId }, { seekerUserId: userId }],
      status: "accepted",
    });

    if (!connection) {
      return res.status(403).json({ message: "Access denied" });
    }

    const messages = await Message.find({ connectionId })
      .populate("senderId", "name email")
      .populate("receiverId", "name email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Mark messages as delivered if receiver is viewing
    const unreadMessages = messages.filter(
      (msg) =>
        msg.receiverId._id.toString() === userId.toString() && !msg.delivered
    );

    if (unreadMessages.length > 0) {
      await Message.updateMany(
        { _id: { $in: unreadMessages.map((m) => m._id) } },
        { delivered: true, deliveredAt: new Date() }
      );
    }

    res.status(200).json({
      messages: messages.reverse(),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: await Message.countDocuments({ connectionId }),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Send text message
export const sendMessage = async (req, res) => {
  try {
    const { connectionId, content } = req.body;
    const senderId = req.user._id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: "Message content is required" });
    }

    // Verify connection
    const connection = await Connection.findOne({
      _id: connectionId,
      $or: [{ helperUserId: senderId }, { seekerUserId: senderId }],
    });

    if (!connection) {
      return res.status(403).json({ message: "Invalid connection" });
    }

    // Check if Pro required for pending connections
    if (connection.status === "pending") {
      const user = await User.findById(senderId);
      const isPro =
        user.subscription?.plan === "pro" &&
        user.subscription?.status === "active";

      if (!isPro) {
        return res.status(403).json({
          message: "Buddy Pro required to message pending connections",
          requiresPro: true,
        });
      }
    } else if (connection.status !== "accepted") {
      return res.status(403).json({
        message: "Connection must be accepted to send messages",
      });
    }

    const receiverId =
      connection.helperUserId.toString() === senderId.toString()
        ? connection.seekerUserId
        : connection.helperUserId;

    const message = new Message({
      connectionId,
      senderId,
      receiverId,
      content: content.trim(),
      messageType: "text",
      delivered: false,
    });

    await message.save();
    await message.populate("senderId", "name email");
    await message.populate("receiverId", "name email");

    // Emit real-time notification via socket
    const io = getIO();
    if (io) {
      // Emit to connection room for real-time update
      io.to(`connection:${connectionId}`).emit("new_message", {
        ...message.toObject(),
        senderId: {
          _id: message.senderId._id,
          name: message.senderId.name,
          email: message.senderId.email,
        },
        receiverId: {
          _id: message.receiverId._id,
          name: message.receiverId.name,
          email: message.receiverId.email,
        },
      });

      // Send notification to receiver's personal room
      io.to(`user:${receiverId}`).emit("notification", {
        type: "message",
        title: "New Message",
        message: `New message from ${message.senderId.name}`,
        connectionId: connectionId,
        messageId: message._id,
        senderName: message.senderId.name,
        timestamp: new Date(),
      });
    }

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Upload file/image
export const uploadFile = async (req, res) => {
  try {
    const { connectionId } = req.body;
    const senderId = req.user._id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Verify connection
    const connection = await Connection.findOne({
      _id: connectionId,
      $or: [{ helperUserId: senderId }, { seekerUserId: senderId }],
      status: "accepted",
    });

    if (!connection) {
      return res.status(403).json({ message: "Invalid connection" });
    }

    const receiverId =
      connection.helperUserId.toString() === senderId.toString()
        ? connection.seekerUserId
        : connection.helperUserId;

    const fileName = generateFileName(file.originalname);
    let uploadResult;

    // Upload to Cloudinary
    if (file.mimetype.startsWith("image/")) {
      // Upload image with thumbnail
      uploadResult = await uploadImageToCloudinary(
        file.buffer,
        fileName,
        file.mimetype,
        "messages"
      );
    } else {
      // Upload regular file
      uploadResult = await uploadToCloudinary(
        file.buffer,
        fileName,
        file.mimetype,
        "messages"
      );
    }

    const message = new Message({
      connectionId,
      senderId,
      receiverId,
      messageType: file.mimetype.startsWith("image/") ? "image" : "file",
      attachment: {
        url: uploadResult.url,
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size || uploadResult.bytes,
        thumbnail: uploadResult.thumbnail || null,
        fileId: uploadResult.public_id, // Store Cloudinary public_id instead of B2 fileId
        thumbnailFileId: uploadResult.public_id, // Thumbnail uses same public_id with transformations
      },
      delivered: false,
    });

    await message.save();
    await message.populate("senderId", "name email");
    await message.populate("receiverId", "name email");

    // Emit real-time notification via socket
    const io = getIO();
    if (io) {
      io.to(`connection:${connectionId}`).emit("new_message", {
        ...message.toObject(),
        senderId: {
          _id: message.senderId._id,
          name: message.senderId.name,
          email: message.senderId.email,
        },
        receiverId: {
          _id: message.receiverId._id,
          name: message.receiverId.name,
          email: message.receiverId.email,
        },
      });

      io.to(`user:${receiverId}`).emit("notification", {
        type: "file",
        title: "New File",
        message: `${message.senderId.name} sent a ${
          file.mimetype.startsWith("image/") ? "photo" : "file"
        }`,
        connectionId: connectionId,
        messageId: message._id,
        senderName: message.senderId.name,
        timestamp: new Date(),
      });
    }

    res.status(201).json(message);
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: error.message || "Failed to upload file" });
  }
};

// Mark messages as read
export const markAsRead = async (req, res) => {
  try {
    const { messageIds } = req.body;
    const userId = req.user._id;

    if (!Array.isArray(messageIds) || messageIds.length === 0) {
      return res.status(400).json({ message: "Invalid message IDs" });
    }

    // Only mark messages where user is the receiver
    const result = await Message.updateMany(
      {
        _id: { $in: messageIds },
        receiverId: userId,
        read: false,
      },
      {
        read: true,
        readAt: new Date(),
      }
    );

    res.status(200).json({
      message: "Messages marked as read",
      count: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search messages
export const searchMessages = async (req, res) => {
  try {
    const { connectionId, query, page = 1, limit = 20 } = req.query;
    const userId = req.user._id;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Verify connection
    const connection = await Connection.findOne({
      _id: connectionId,
      $or: [{ helperUserId: userId }, { seekerUserId: userId }],
      status: "accepted",
    });

    if (!connection) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Text search
    const searchRegex = new RegExp(query.trim(), "i");
    const messages = await Message.find({
      connectionId,
      $or: [{ content: searchRegex }, { "attachment.filename": searchRegex }],
    })
      .populate("senderId", "name email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.status(200).json({
      messages: messages.reverse(),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: await Message.countDocuments({
          connectionId,
          $or: [
            { content: searchRegex },
            { "attachment.filename": searchRegex },
          ],
        }),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get unread count
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;

    const count = await Message.countDocuments({
      receiverId: userId,
      read: false,
    });

    res.status(200).json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
