import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./libs/connect.js";

// user routes
import userRoutes from "./routes/userRoutes.js";
import companionRequestRoutes from "./routes/companionRequestRoutes.js";
import errorHandler from "./utils/errorHandler.js";
import flightroutes from "./routes/flightRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
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
