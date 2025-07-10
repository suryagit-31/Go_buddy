import jwt from "jsonwebtoken";
import cookieparser from "cookie-parser";

export const generate_token = async (user_id, res) => {
  const token = jwt.sign({ user_id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "strict",
  });

  return token;
};
