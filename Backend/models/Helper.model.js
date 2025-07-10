// models/HelperRequest.js
import mongoose from "mongoose";
import companionBaseSchema from "./CompanionRequest.model.js";

export const HelperRequest = mongoose.model(
  "HelperRequest",
  companionBaseSchema,
  "Helpers"
);
