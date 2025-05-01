import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    role: String, // traveler or family
    age: Number,
    phone: String,
    email: String,
    language: String,
    location: String,
    profileImage: String,
    createdBy: mongoose.Types.ObjectId,
    verified: Boolean,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
