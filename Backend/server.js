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
<<<<<<< HEAD
  "http://localhost:3001",
  "http://localhost:5173", // for dev
  "https://go-buddy-2.vercel.app",
  "https://go-buddy-alpha.vercel.app", // your vercel frontend
=======
  "http://localhost:3001", // for dev
  "https://go-buddy-2.vercel.app",
  "https://go-buddy-alpha.vercel.app" // your vercel frontend
>>>>>>> 30b81bf8857f2dc693297013e31a48c449b043af
];

app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrgins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
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
