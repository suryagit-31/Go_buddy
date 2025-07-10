import express from "express";
import {
  signup,
  check_Auth,
  logout,
  login,
  updateProfile,
} from "../controllers/authcontroller.js";
import { protected_Route } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/logout", logout);
router.post("/login", login);
router.get("/check", protected_Route, check_Auth);
router.put("/updateprofile", protected_Route, updateProfile);
export default router;
