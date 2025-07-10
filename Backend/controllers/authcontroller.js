import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import { generate_token } from "../libs/util.js";

export const signup = async (req, res) => {
  console.log(req.body);
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

    //  console.log(newuser_model);

    if (newuser_model) {
      await newuser_model.save();
      generate_token(newuser_model._id, res);
      // Call after saving the user
    }

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
  console.log(req.body);
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
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.age = age || user.age;
    user.bio = bio || user.bio;
    user.city = city || user.city;
    user.languages = languages || user.languages;
    user.medicalConditions = medicalConditions || user.medicalConditions;
    user.emergencyContact.name = emergencyContact || user.emergencyContact;
    user.emergencyContact.phone = emergencyPhone || user.emergencyPhone;
    await user.save();
    return res.status(200).json({ message: "profile updated successfully" });
  } catch (error) {
    console.log(error);
  }
};
export const logout = (req, res) => {
  try {
    res.clearCookie("jwt", { maxAge: 0, httpOnly: true, secure: true });
    return res.status(200).json({ message: "user logged out" });
  } catch (error) {
    // console.log("error in logging out:", error.message);
    return res
      .status(404)
      .json({ message: "server error cannot log out Try again" });
  }
};

export const check_Auth = async (req, res) => {
  try {
    if (!req.user) {
      // If `req.user` is not present, send a 401 Unauthorized response and stop execution
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authenticated" });
    }
    return res.status(201).json(req.user);
  } catch (error) {
    console.log("error in checking auth controller  ", error.message);
    return res.status(400).json({ message: "error in checking authorisation" });
  }
};
