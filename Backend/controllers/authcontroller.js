import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import { generate_token } from "../libs/util.js";
import {
  uploadProfilePicture as uploadProfilePictureToCloudinary,
  deleteFromCloudinary,
  generateFileName,
} from "../services/cloudinaryService.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password, phone, age } = req.body;
    if (!name || !email || !password || !phone || !age) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: " This mail already exists" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 8 charcters " });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    const newuser_model = new User({
      name: name,
      email: email,
      password: hashedpassword,
      phone: phone,
      age: age,
      role: "user",
    });

    await newuser_model.save();
    generate_token(newuser_model._id, res);

    return res.status(201).json({
      message: "user created successfully",
      name: newuser_model.name,
      email: newuser_model.email,
      phone: newuser_model.phone,
      age: newuser_model.age,
      Id: newuser_model._id,
      medicalConditions: newuser_model.medicalConditions,
      languages: newuser_model.languages,
      emergencyphone: newuser_model.emergencyContact.phone,
      city: newuser_model.city,
      createdAt: newuser_model.createdAt,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "invalid user data provided" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 8 charcters " });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Invalid login-check your credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(404)
        .json({ message: "Invalid login-check your credentials" });
    }

    generate_token(user._id, res);
    return res.status(200).json({
      message: "user logged in",
      name: user.name,
      email: user.email,
      phone: user.phone,
      age: user.age,
      Id: user._id,
      medicalConditions: user.medicalConditions,
      emergencyphone: user.emergencyContact.phone,
      languages: user.languages,
      city: user.city,
      createdAt: user.createdAt,
    });
  } catch (error) {
    return res.status(404).json({ message: "invalid user data " });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      age,
      bio,
      city,
      languages,
      medicalConditions,
      emergencyContact,
      emergencyPhone,
    } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    if (name !== undefined) user.name = name;
    if (age !== undefined) user.age = age;
    if (bio !== undefined) user.bio = bio;
    if (city !== undefined) user.city = city;
    if (languages !== undefined) user.languages = languages;
    if (medicalConditions !== undefined)
      user.medicalConditions = medicalConditions;
    if (emergencyContact !== undefined)
      user.emergencyContact.name = emergencyContact;
    if (emergencyPhone !== undefined)
      user.emergencyContact.phone = emergencyPhone;

    await user.save();

    const updatedUser = await User.findById(req.user._id).select("-password");
    const userObject = updatedUser.toObject();

    return res.status(200).json({
      message: "profile updated successfully",
      ...userObject,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    console.error("Error stack:", error.stack);
    return res.status(500).json({
      message: "Error updating profile",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Upload profile picture
export const uploadProfilePicture = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.user._id;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!file.mimetype.startsWith("image/")) {
      return res.status(400).json({ message: "File must be an image" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.profilePicture?.public_id) {
      await deleteFromCloudinary(user.profilePicture.public_id, "image");
    }

    const fileName = generateFileName(file.originalname, "profile-");
    const uploadResult = await uploadProfilePictureToCloudinary(
      file.buffer,
      fileName,
      file.mimetype
    );

    if (!user.profilePicture) {
      user.profilePicture = {};
    }

    user.profilePicture.url = uploadResult.url;
    user.profilePicture.public_id = uploadResult.public_id;
    await user.save();

    const updatedUser = await User.findById(userId).select("-password");
    const userObject = updatedUser.toObject();

    return res.status(200).json({
      message: "Profile picture uploaded successfully",
      profilePicture: userObject.profilePicture,
      user: userObject,
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    console.error("Error stack:", error.stack);
    return res.status(500).json({
      message: "Error uploading profile picture",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
export const logout = (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });
    return res.status(200).json({ message: "user logged out" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "server error cannot log out Try again" });
  }
};

export const check_Auth = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authenticated" });
    }
    return res.status(200).json(req.user);
  } catch (error) {
    console.error("Error checking auth:", error.message);
    return res.status(500).json({ message: "error in checking authorisation" });
  }
};
