import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import connectDB from "./libs/connect.js";
import userRoutes from "./routes/userRoutes.js";
import companionRequestRoutes from "./routes/companionRequestRoutes.js";
import connectionRoutes from "./routes/connectionRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import housingRoutes from "./routes/housingRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import errorHandler from "./utils/errorHandler.js";
import flightroutes from "./routes/flightRoutes.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { initializeSocket } from "./socket/socketServer.js";
import { scheduleReminders } from "./services/reminderScheduler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrgins = [
  "http://localhost:3000", // for dev
  "http://localhost:3001",
  "http://localhost:5173", // for dev
  "https://go-buddy-2.vercel.app",
  "https://go-buddy-alpha.vercel.app", // your vercel frontend
];

app.use(express.json());

// Enhanced CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or curl)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrgins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Set-Cookie"],
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options("*", cors(corsOptions));

app.use(cookieParser());

try {
  app.use("/user", userRoutes);
  app.use("/companions", companionRequestRoutes);
  app.use("/connections", connectionRoutes);
  app.use("/messages", messageRoutes);
  app.use("/payments", paymentRoutes);
  app.use("/subscriptions", subscriptionRoutes);
  app.use("/flights", flightroutes);
  app.use("/housing", housingRoutes);
  app.use("/notifications", notificationRoutes);
  console.log("✅ All routes loaded");
} catch (err) {
  console.error("❌ Route mounting error:", err);
}
app.use(errorHandler);

// Create HTTP server for Socket.io
const server = createServer(app);

// Initialize Socket.io
const io = initializeSocket(server);

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Socket.io initialized`);

      // Schedule reminder jobs
      scheduleReminders();
    });
  })
  .catch((err) => {
    console.error("Database connection failed", err);
    process.exit(1); // Exit process if DB connection fails
  });
