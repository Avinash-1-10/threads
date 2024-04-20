import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookies from "../utils/helpers/generateTokenandSetCookies.js";
import mongoose from "mongoose";

const signup = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();
    if (newUser) {
      const user = await User.findById(newUser._id).select(
        "-password -avatar -bio -createdAt -updatedAt -__v"
      );
      const threadsToken = generateTokenAndSetCookies(user._id, res);
      return res.status(201).json({ user, threadsToken });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup: ", error.message);
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return res.status(400).json({ message: "username is Invalid" });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "password is incorrect" });
    }
    const user = await User.findById(existingUser._id).select(
      "-password -avatar -bio -createdAt -updatedAt -__v"
    );
    const threadsToken = generateTokenAndSetCookies(user._id, res);
    return res.status(201).json({ user, threadsToken });
  } catch (error) {
    console.log("Error in login: ", error.message);
    return res.status(500).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("threadsToken", "", { maxAge: 1 });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.log("Error in logout: ", error.message);
    return res.status(500).json({ message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  const { query } = req.params;

  try {
    let user;
    if (mongoose.Types.ObjectId.isValid(query)) {
      user = await User.findOne({ _id: query })
        .select("-password")
        .select("-updatedAt");
    } else {
      user = await User.findOne({ username: query })
        .select("-password")
        .select("-updatedAt");
    }

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in getUserProfile: ", err.message);
  }
};

const updateUser = async (req, res) => {
  const { name, email, username, password, bio } = req.body;
  let { profilePic } = req.body;

  const userId = req.user._id;
  try {
    let user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found" });

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    // if (profilePic) {
    //   if (user.profilePic) {
    //     await cloudinary.uploader.destroy(
    //       user.profilePic.split("/").pop().split(".")[0]
    //     );
    //   }

    //   const uploadedResponse = await cloudinary.uploader.upload(profilePic);
    //   profilePic = uploadedResponse.secure_url;
    // }

    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;

    user = await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in updateUser: ", err.message);
  }
};

export { signup, login, logout, updateUser, getUserProfile };
