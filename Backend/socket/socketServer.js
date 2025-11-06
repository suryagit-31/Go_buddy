import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import Message from "../models/Message.model.js";
import Connection from "../models/Connection.model.js";

let ioInstance = null;

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  // Store typing users per connection
  const typingUsers = new Map(); // connectionId -> Set of userIds

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth.token ||
        socket.handshake.headers.authorization?.split(" ")[1];

      if (!token) {
        return next(new Error("Authentication error"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.user_id).select("-password");

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.userId}`);

    // Join user's personal room
    socket.join(`user:${socket.userId}`);

    // Join connection room
    socket.on("join_connection", async (connectionId) => {
      socket.join(`connection:${connectionId}`);
      console.log(`User ${socket.userId} joined connection ${connectionId}`);
    });

    // Leave connection room
    socket.on("leave_connection", (connectionId) => {
      socket.leave(`connection:${connectionId}`);
      // Remove from typing users
      if (typingUsers.has(connectionId)) {
        typingUsers.get(connectionId).delete(socket.userId);
      }
    });

    // Typing indicator - start typing
    socket.on("typing_start", async (data) => {
      const { connectionId } = data;

      // Verify connection
      const connection = await Connection.findOne({
        _id: connectionId,
        $or: [
          { helperUserId: socket.userId },
          { seekerUserId: socket.userId },
        ],
        status: "accepted",
      });

      if (!connection) return;

      // Add user to typing set
      if (!typingUsers.has(connectionId)) {
        typingUsers.set(connectionId, new Set());
      }
      typingUsers.get(connectionId).add(socket.userId);

      // Notify other user
      const otherUserId =
        connection.helperUserId.toString() === socket.userId
          ? connection.seekerUserId.toString()
          : connection.helperUserId.toString();

      io.to(`user:${otherUserId}`).emit("user_typing", {
        connectionId,
        userId: socket.userId,
        userName: socket.user.name,
        isTyping: true,
      });
    });

    // Typing indicator - stop typing
    socket.on("typing_stop", async (data) => {
      const { connectionId } = data;

      if (typingUsers.has(connectionId)) {
        typingUsers.get(connectionId).delete(socket.userId);
      }

      // Verify connection
      const connection = await Connection.findOne({
        _id: connectionId,
        $or: [
          { helperUserId: socket.userId },
          { seekerUserId: socket.userId },
        ],
        status: "accepted",
      });

      if (!connection) return;

      const otherUserId =
        connection.helperUserId.toString() === socket.userId
          ? connection.seekerUserId.toString()
          : connection.helperUserId.toString();

      io.to(`user:${otherUserId}`).emit("user_typing", {
        connectionId,
        userId: socket.userId,
        userName: socket.user.name,
        isTyping: false,
      });
    });

    // Handle new message
    socket.on("send_message", async (data) => {
      try {
        // Verify connection
        const connection = await Connection.findOne({
          _id: data.connectionId,
          $or: [
            { helperUserId: socket.userId },
            { seekerUserId: socket.userId },
          ],
          status: "accepted",
        });

        if (!connection) {
          socket.emit("error", { message: "Invalid connection" });
          return;
        }

        // Create message (assuming it's already saved via API)
        // This is just for real-time broadcasting
        const message = {
          ...data,
          senderId: {
            _id: socket.userId,
            name: socket.user.name,
            email: socket.user.email,
          },
          createdAt: new Date(),
        };

        // Emit to connection room
        io.to(`connection:${data.connectionId}`).emit("new_message", message);

        // Send notification to receiver if not in room
        const receiverId =
          connection.helperUserId.toString() === socket.userId
            ? connection.seekerUserId.toString()
            : connection.helperUserId.toString();

        io.to(`user:${receiverId}`).emit("notification", {
          type: "message",
          title: "New Message",
          message: `New message from ${socket.user.name}`,
          connectionId: data.connectionId,
          relatedId: data._id || message._id,
        });

        // Stop typing indicator
        if (typingUsers.has(data.connectionId)) {
          typingUsers.get(data.connectionId).delete(socket.userId);
        }
      } catch (error) {
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Mark messages as read
    socket.on("mark_read", async (data) => {
      try {
        const { messageIds, connectionId } = data;

        // Update messages
        await Message.updateMany(
          {
            _id: { $in: messageIds },
            receiverId: socket.userId,
            read: false,
          },
          {
            read: true,
            readAt: new Date(),
          }
        );

        // Notify sender
        const messages = await Message.find({
          _id: { $in: messageIds },
        }).populate("senderId", "name email");

        const senderIds = [...new Set(messages.map((m) => m.senderId._id.toString()))];

        senderIds.forEach((senderId) => {
          io.to(`user:${senderId}`).emit("messages_read", {
            connectionId,
            messageIds,
            readBy: socket.userId,
            readAt: new Date(),
          });
        });
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    });

    // Mark message as delivered
    socket.on("message_delivered", async (data) => {
      try {
        const { messageId } = data;

        await Message.updateOne(
          { _id: messageId, receiverId: socket.userId },
          { delivered: true, deliveredAt: new Date() }
        );

        // Notify sender
        const message = await Message.findById(messageId);
        if (message) {
          io.to(`user:${message.senderId}`).emit("message_delivered", {
            messageId,
            deliveredTo: socket.userId,
            deliveredAt: new Date(),
          });
        }
      } catch (error) {
        console.error("Error marking message as delivered:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}`);
      // Clean up typing indicators
      typingUsers.forEach((users, connectionId) => {
        users.delete(socket.userId);
        if (users.size === 0) {
          typingUsers.delete(connectionId);
        }
      });
    });
  });

  ioInstance = io;
  return io;
};

export const getIO = () => ioInstance;

