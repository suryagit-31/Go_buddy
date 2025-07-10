import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const protected_Route = async (req, res, next) => {
  try {
    const our_cookie =
      req.cookies.jwt || req.headers.authorization?.split(" ")[1];

    // console.log("cookie", our_cookie);

    if (!our_cookie) {
      // console.log("no cookie found");
      return res.status(401).json({ message: "un-authorised :Token Missing" });
    }

    const verify_user = jwt.verify(our_cookie, process.env.JWT_SECRET);

    if (!verify_user) {
      // console.log("invalid token");
      return res.status(400).json({ message: "unauthorised -Invalid token" });
    }
    //console.log(verify_user);

    const user = await User.findById(verify_user.user_id).select("-password");

    //console.log(user);

    if (!user) {
      //console.log("user not found on this server");
      return res.status(400).json({ message: "user not found on this server" });
    }

    //  console.log("i have the user in this server ");

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protected_Route middleware:", error);
    res.status(500).json({ message: "Internal Server Error in middleware" });
  }
};
