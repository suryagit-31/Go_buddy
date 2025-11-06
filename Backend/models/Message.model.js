import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    connectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Connection",
      required: true,
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      maxlength: 5000,
    },
    messageType: {
      type: String,
      enum: ["text", "image", "file", "system", "reminder"],
      default: "text",
    },
    // File/image attachment
    attachment: {
      url: {
        type: String,
      },
      filename: {
        type: String,
      },
      mimetype: {
        type: String,
      },
      size: {
        type: Number, // in bytes
      },
      thumbnail: {
        type: String, // For images - compressed version URL
      },
      fileId: {
        type: String, // Cloudinary public_id for deletion
      },
      thumbnailFileId: {
        type: String, // Cloudinary public_id for thumbnail (same as fileId with transformations)
      },
    },
    // Read receipt tracking
    read: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    delivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Indexes for efficient queries
messageSchema.index({ connectionId: 1, createdAt: -1 });
messageSchema.index({ receiverId: 1, read: 1 });
messageSchema.index({ senderId: 1, createdAt: -1 });
messageSchema.index({ content: "text" }); // Text search index

const Message = mongoose.model("Message", messageSchema);

export default Message;
