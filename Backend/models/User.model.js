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
      minLength: 8,
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
    city: {
      type: String,
      default: null,
    },
    languages: {
      type: [String],
      default: null,
    },
    bio: {
      type: String,
      default: null,
    },
    emergencyContact: {
      name: {
        type: String,
        default: null,
      },
      phone: {
        type: String,
        default: null,
      },
    },
    medicalConditions: {
      type: String,
      default: null,
    },
    profilePicture: {
      url: {
        type: String,
        default: null,
      },
      public_id: {
        type: String,
        default: null,
      },
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    subscription: {
      status: {
        type: String,
        enum: [
          "free",
          "active",
          "cancelled",
          "past_due",
          "incomplete",
          "trialing",
        ],
        default: "free",
      },
      plan: {
        type: String,
        enum: ["free", "pro"],
        default: "free",
      },
      stripeCustomerId: {
        type: String,
      },
      stripeSubscriptionId: {
        type: String,
      },
      currentPeriodEnd: {
        type: Date,
      },
      cancelAtPeriodEnd: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
