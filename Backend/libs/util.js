import { truncates } from "bcryptjs";
import jwt from "jsonwebtoken";

export const generate_token = async (user_id, res) => {
  // Generate JWT token with 30 days expiration
  const token = jwt.sign({ user_id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Increased from 7d to 30d
  });

  // Calculate expiration date (30 days from now)
  const expirationDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  // Set cookie with proper configuration
  res.cookie("jwt", token, {
    expires: expirationDate,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    httpOnly: true, // Prevents JavaScript access (security)
    secure: true, // Only send over HTTPS in production
    sameSite: "none",
    path: "/", // Available across entire site
  });

  return token;
};
