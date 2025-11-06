import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

// Optional authentication middleware - doesn't fail if no token
export const optionalAuth = async (req, res, next) => {
  try {
    const our_cookie =
      req.cookies.jwt || req.headers.authorization?.split(" ")[1];

    if (our_cookie) {
      try {
        const verify_user = jwt.verify(our_cookie, process.env.JWT_SECRET);
        if (verify_user) {
          const user = await User.findById(verify_user.user_id).select(
            "-password"
          );
          if (user) {
            req.user = user;
          }
        }
      } catch (error) {
        // Invalid token, but continue without user
        req.user = null;
      }
    }
    next();
  } catch (error) {
    // Continue without user on error
    req.user = null;
    next();
  }
};
