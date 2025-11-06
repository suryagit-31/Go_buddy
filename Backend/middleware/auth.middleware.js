import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const protected_Route = async (req, res, next) => {
  try {
    const our_cookie =
      req.cookies.jwt || req.headers.authorization?.split(" ")[1];

    if (!our_cookie) {
      return res.status(401).json({ message: "un-authorised :Token Missing" });
    }

    try {
      const verify_user = jwt.verify(our_cookie, process.env.JWT_SECRET);

      if (!verify_user) {
        return res.status(400).json({ message: "unauthorised -Invalid token" });
      }

      const user = await User.findById(verify_user.user_id).select("-password");

      if (!user) {
        return res
          .status(400)
          .json({ message: "user not found on this server" });
      }

      req.user = user;
      next();
    } catch (jwtError) {
      // Handle JWT specific errors
      if (jwtError.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Token expired. Please login again.",
          code: "TOKEN_EXPIRED",
        });
      } else if (jwtError.name === "JsonWebTokenError") {
        return res.status(401).json({
          message: "Invalid token. Please login again.",
          code: "INVALID_TOKEN",
        });
      }
      throw jwtError;
    }
  } catch (error) {
    console.error("Error in protected_Route middleware:", error);
    res.status(500).json({ message: "Internal Server Error in middleware" });
  }
};
