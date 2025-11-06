import express from "express";
import {
  signup,
  check_Auth,
  logout,
  login,
  updateProfile,
  uploadProfilePicture,
} from "../controllers/authcontroller.js";
import { protected_Route } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/logout", logout);
router.post("/login", login);
router.get("/check", protected_Route, check_Auth);
router.put("/updateprofile", protected_Route, updateProfile);
router.post(
  "/upload-profile-picture",
  protected_Route,
  upload.single("profilePicture"),
  uploadProfilePicture
);
export default router;
