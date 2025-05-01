import mongoose from "mongoose";
import { config } from "dotenv";

config();

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined or missing ");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to database");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
