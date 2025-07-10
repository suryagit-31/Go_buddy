import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./libs/connect.js";
import userRoutes from "./routes/userRoutes.js";
import companionRequestRoutes from "./routes/companionRequestRoutes.js";
import errorHandler from "./utils/errorHandler.js";
import flightroutes from "./routes/flightRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
//const allowedOrigins = ["http://localhost:3001", "http://localhost:3000"];
app.use(express.json({ limit: "10mb" }));
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
console.log("Allowed origins:", process.env.ALLOWED_ORIGINS);
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/companions", companionRequestRoutes);
app.use("/api/flights", flightroutes);
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
