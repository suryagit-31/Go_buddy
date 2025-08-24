import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./libs/connect.js";
import userRoutes from "./routes/userRoutes.js";
import companionRequestRoutes from "./routes/companionRequestRoutes.js";
import errorHandler from "./utils/errorHandler.js";
import flightroutes from "./routes/flightRoutes.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrgins = [
  "http://localhost:3000", // for dev
  "http://localhost:3001", // for dev
  "https://go-buddy-2.vercel.app",
  "https://go-buddy-alpha.vercel.app" // your vercel frontend
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
  app.use("/flights", flightroutes);
  console.log("✅ All routes loaded");
} catch (err) {
  console.error("❌ Route mounting error:", err);
}
app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed", err);
    process.exit(1); // Exit process if DB connection fails
  });
