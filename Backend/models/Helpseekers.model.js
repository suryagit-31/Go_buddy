import mongoose from "mongoose";
import companionBaseSchema from "./CompanionRequest.model.js";

export const HelpSeekerRequest = mongoose.model(
  "HelpSeekerRequest",
  companionBaseSchema,
  "Helpseekers"
);
