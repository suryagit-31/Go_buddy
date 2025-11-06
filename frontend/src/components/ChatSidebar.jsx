import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Paperclip,
  Image as ImageIcon,
  User,
  Minimize2,
  Maximize2,
  Circle,
} from "lucide-react";
import useMessageStore from "../store/useMessageStore";
import useConnectionStore from "../store/useConnectionStore";
import useAuthStore from "../store/useAuthstore";
import { getSocket, startTyping, stopTyping } from "../utils/socket";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axios";

const ChatSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const { authUser } = useAuthStore();
  const { connections, getUserConnections } = useConnectionStore();
  const {
    messages,
    typingUsers,
    fetchMessages,
    sendMessage,
    uploadFile,
    addMessage,
    markAsRead,
    setTypingUser,
    initializeSocketListeners,
  } = useMessageStore();

  // Fetch connections on mount
  useEffect(() => {
    getUserConnections("accepted");
  }, [getUserConnections]);

  // Fetch messages when connection is selected
  useEffect(() => {
    if (selectedConnection) {
      fetchMessages(selectedConnection._id);
      // Mark messages as read when viewing
      const connectionMessages = messages[selectedConnection._id] || [];
      const unreadIds = connectionMessages
        .filter(
          (msg) => msg.receiverId?._id?.toString() === authUser?.Id && !msg.read
        )
        .map((msg) => msg._id);
      if (unreadIds.length > 0) {
        markAsRead(unreadIds, selectedConnection._id);
      }
    }
  }, [selectedConnection, fetchMessages]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (selectedConnection && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages[selectedConnection?._id], selectedConnection]);

  // Initialize socket listeners
  useEffect(() => {
    initializeSocketListeners();
  }, [initializeSocketListeners]);

  // Mark messages as read when viewing
  useEffect(() => {
    if (selectedConnection) {
      const connectionMessages = messages[selectedConnection._id] || [];
      const unreadIds = connectionMessages
        .filter(
          (msg) =>
            (msg.receiverId?._id?.toString() === authUser?.Id ||
              msg.receiverId?.toString() === authUser?.Id) &&
            !msg.read
        )
        .map((msg) => msg._id);
      if (unreadIds.length > 0) {
        markAsRead(unreadIds, selectedConnection._id);
      }
    }
  }, [selectedConnection, messages, authUser, markAsRead]);

  const getOtherUser = (connection) => {
    if (
      connection.helperUserId?._id?.toString() === authUser?.Id ||
      connection.helperUserId?.toString() === authUser?.Id
    ) {
      return connection.seekerUserId;
    }
    return connection.helperUserId;
  };

  const acceptedConnections = connections.filter(
    (c) => c.status === "accepted"
  );

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedConnection) return;

    try {
      await sendMessage(selectedConnection._id, messageInput);
      setMessageInput("");
      stopTyping(selectedConnection._id);
      setIsTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  };

  const handleTyping = () => {
    if (!selectedConnection) return;

    if (!isTyping) {
      setIsTyping(true);
      startTyping(selectedConnection._id);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping(selectedConnection._id);
      setIsTyping(false);
    }, 3000);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedConnection) return;

    try {
      await uploadFile(selectedConnection._id, file);
      toast.success("File uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload file");
    }
    e.target.value = ""; // Reset input
  };

  const formatTime = (date) => {
    const msgDate = new Date(date);
    const now = new Date();
    const diffMs = now - msgDate;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return msgDate.toLocaleDateString();
  };

  const getUnreadCount = (connectionId) => {
    const connectionMessages = messages[connectionId] || [];
    return connectionMessages.filter(
      (msg) => msg.receiverId?._id?.toString() === authUser?.Id && !msg.read
    ).length;
  };

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-colors z-40"
        >
          <MessageSquare className="h-6 w-6" />
          {acceptedConnections.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {acceptedConnections.length}
            </span>
          )}
        </motion.button>
      )}

      {/* Chat Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className={`fixed right-0 top-0 h-full bg-white shadow-2xl z-50 flex flex-col ${
              isMinimized ? "w-80" : "w-96"
            }`}
          >
            {/* Header */}
            <div className="bg-primary-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                <h3 className="font-semibold">Messages</h3>
                {acceptedConnections.length > 0 && (
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                    {acceptedConnections.length}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="hover:bg-white/20 p-1 rounded"
                >
                  {isMinimized ? (
                    <Maximize2 className="h-4 w-4" />
                  ) : (
                    <Minimize2 className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setSelectedConnection(null);
                  }}
                  className="hover:bg-white/20 p-1 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {!selectedConnection ? (
              /* Connections List */
              <div className="flex-1 overflow-y-auto">
                {acceptedConnections.length === 0 ? (
                  <div className="p-8 text-center text-neutral-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No accepted connections yet</p>
                    <p className="text-sm mt-2">
                      Accept a connection request to start messaging
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-100">
                    {acceptedConnections.map((connection) => {
                      const otherUser = getOtherUser(connection);
                      const unreadCount = getUnreadCount(connection._id);
                      const lastMessage =
                        messages[connection._id]?.[
                          messages[connection._id].length - 1
                        ];

                      return (
                        <button
                          key={connection._id}
                          onClick={() => setSelectedConnection(connection)}
                          className="w-full p-4 hover:bg-neutral-50 transition-colors text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                                <User className="h-6 w-6 text-primary-600" />
                              </div>
                              {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                  {unreadCount}
                                </span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="font-semibold text-neutral-900 truncate">
                                  {otherUser?.name || "Unknown"}
                                </p>
                                {lastMessage && (
                                  <span className="text-xs text-neutral-500">
                                    {formatTime(lastMessage.createdAt)}
                                  </span>
                                )}
                              </div>
                              {lastMessage && (
                                <p className="text-sm text-neutral-600 truncate mt-1">
                                  {lastMessage.content ||
                                    (lastMessage.attachment
                                      ? "📎 Attachment"
                                      : "")}
                                </p>
                              )}
                              {!lastMessage && (
                                <p className="text-sm text-neutral-400 mt-1">
                                  No messages yet
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* Chat Window */
              <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedConnection(null)}
                      className="text-neutral-600 hover:text-neutral-900"
                    >
                      ←
                    </button>
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900">
                        {getOtherUser(selectedConnection)?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {selectedConnection.flight_iata} •{" "}
                        {new Date(
                          selectedConnection.flight_date
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50">
                  {messages[selectedConnection._id]?.length === 0 ? (
                    <div className="text-center text-neutral-500 mt-8">
                      <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No messages yet</p>
                      <p className="text-sm mt-2">Start the conversation!</p>
                    </div>
                  ) : (
                    messages[selectedConnection._id]?.map((message) => {
                      // Check if message is from current user
                      const senderId =
                        message.senderId?._id || message.senderId;
                      const currentUserId = authUser?._id || authUser?.Id;
                      const isOwnMessage =
                        senderId?.toString() === currentUserId?.toString();

                      return (
                        <motion.div
                          key={message._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`flex w-full ${
                            isOwnMessage ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm ${
                              isOwnMessage
                                ? "bg-primary-600 text-white rounded-br-sm"
                                : "bg-white text-neutral-900 rounded-bl-sm border border-neutral-200"
                            }`}
                          >
                            {!isOwnMessage && (
                              <p className="text-xs font-semibold mb-1.5 opacity-80">
                                {message.senderId?.name || "Unknown"}
                              </p>
                            )}
                            {message.content && (
                              <p
                                className={`text-sm ${
                                  isOwnMessage
                                    ? "text-white"
                                    : "text-neutral-900"
                                } whitespace-pre-wrap break-words`}
                              >
                                {message.content}
                              </p>
                            )}
                            {message.attachment && (
                              <div className="mt-2">
                                {message.messageType === "image" ? (
                                  <img
                                    src={message.attachment.url}
                                    alt={message.attachment.filename}
                                    className="max-w-full rounded-lg"
                                  />
                                ) : (
                                  <a
                                    href={message.attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-2 underline ${
                                      isOwnMessage
                                        ? "text-white/90"
                                        : "text-primary-600"
                                    }`}
                                  >
                                    <Paperclip className="h-4 w-4" />
                                    {message.attachment.filename}
                                  </a>
                                )}
                              </div>
                            )}
                            <p
                              className={`text-xs mt-1.5 ${
                                isOwnMessage
                                  ? "text-white/70"
                                  : "text-neutral-500"
                              }`}
                            >
                              {formatTime(message.createdAt)}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })
                  )}

                  {/* Typing Indicator */}
                  {typingUsers[selectedConnection._id] && (
                    <div className="flex justify-start">
                      <div className="bg-neutral-100 rounded-lg p-3">
                        <div className="flex gap-1">
                          <Circle className="h-2 w-2 fill-neutral-400 animate-bounce" />
                          <Circle
                            className="h-2 w-2 fill-neutral-400 animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                          <Circle
                            className="h-2 w-2 fill-neutral-400 animate-bounce"
                            style={{ animationDelay: "0.4s" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-4 border-t border-neutral-200"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => {
                        setMessageInput(e.target.value);
                        handleTyping();
                      }}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                      accept="image/*"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 text-neutral-600 hover:text-primary-600 hover:bg-neutral-100 rounded-lg"
                    >
                      <Paperclip className="h-5 w-5" />
                    </button>
                    <button
                      type="submit"
                      disabled={!messageInput.trim()}
                      className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatSidebar;
