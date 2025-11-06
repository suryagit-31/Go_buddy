// TEMPORARY: Comment out all routes, then uncomment one by one to find the problematic route
// This is a copy of server.js with all routes commented out for testing

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import connectDB from "./libs/connect.js";
import errorHandler from "./utils/errorHandler.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { initializeSocket } from "./socket/socketServer.js";
import { scheduleReminders } from "./services/reminderScheduler.js";

// COMMENT OUT ALL ROUTES FIRST - then uncomment one by one
// import userRoutes from "./routes/userRoutes.js";
// import companionRequestRoutes from "./routes/companionRequestRoutes.js";
// import connectionRoutes from "./routes/connectionRoutes.js";
// import messageRoutes from "./routes/messageRoutes.js";
// import paymentRoutes from "./routes/paymentRoutes.js";
// import subscriptionRoutes from "./routes/subscriptionRoutes.js";
// import flightroutes from "./routes/flightRoutes.js";
// import housingRoutes from "./routes/housingRoutes.js";
// import notificationRoutes from "./routes/notificationRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrgins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
  "https://go-buddy-2.vercel.app",
  "https://go-buddy-alpha.vercel.app",
];

app.use(express.json());

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    }
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
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(cookieParser());

// COMMENT OUT ALL ROUTE MOUNTING - uncomment one by one
// app.use("/user", userRoutes);
// app.use("/companions", companionRequestRoutes);
// app.use("/connections", connectionRoutes);
// app.use("/messages", messageRoutes);
// app.use("/payments", paymentRoutes);
// app.use("/subscriptions", subscriptionRoutes);
// app.use("/flights", flightroutes);
// app.use("/housing", housingRoutes);
// app.use("/notifications", notificationRoutes);

app.use(errorHandler);

const server = createServer(app);
const io = initializeSocket(server);

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Socket.io initialized`);
      scheduleReminders();
    });
  })
  .catch((err) => {
    console.error("Database connection failed", err);
    process.exit(1);
  });
