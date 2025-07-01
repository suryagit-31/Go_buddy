import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 7,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
    },

    phone: {
      type: String,
      required: true,
    },
    city: String,
    languages: [String],
    bio: String,
    emergencyContact: {
      name: String,
      phone: String,
    },
    medicalConditions: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
