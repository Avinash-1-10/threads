import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookies from "../utils/helpers/generateTokenAndSetCookies.js";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import uploadOnCloudinary from "../utils/Cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";

const signup = async (req, res) => {
  try {
    // Extract relevant data from the request body
    const { name, email, username, password } = req.body;
    // Check for existing user by email or username
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(409)
        .json(
          new ApiError(
            409,
            "An account with this email or username already exists."
          )
        );
    }
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create and save the new user
    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });
    await newUser.save();
    // Retrieve the newly created user's data excluding sensitive fields
    const user = await User.findById(newUser._id).select(
      "-password -createdAt -updatedAt -__v"
    );
    const threadsToken = generateTokenAndSetCookies(user._id, res);
    // Respond with success and user data
    return res.status(201).json(
      new ApiResponse(201, "Registration successful.", {
        user,
        threadsToken,
      })
    );
  } catch (error) {
    // Log the server error and respond appropriately
    console.error("Error during signup: ", error);
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          error.message || "An Error Occurred while registering."
        )
      );
  }
};

const login = async (req, res) => {
  try {
    // Extract username and password from request body
    const { username, password } = req.body;
    // Attempt to find the user by username
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return res.status(404).json(new ApiError(404, "User not found."));
    }
    // Check if the provided password matches the stored hash
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(401).json(new ApiError(401, "Invalid password."));
    }
    // Fetch user data excluding sensitive details
    const userData = await User.findById(existingUser._id).select(
      "-password -createdAt -updatedAt -__v"
    );
    const threadsToken = generateTokenAndSetCookies(existingUser._id, res);
    // Successful login response
    return res.status(200).json(
      new ApiResponse(200, "Logged in successfully.", {
        user: userData,
        threadsToken,
      })
    );
  } catch (error) {
    // Log the error and return a generic server error response
    console.error("Error in login: ", error);
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          error.message || "An Error Occurred while logging in."
        )
      );
  }
};

const logout = async (req, res) => {
  try {
    // Clear the authentication token cookie
    res.cookie("threadsToken", "", { maxAge: 1 });
    // Respond with success message
    return res
      .status(200)
      .json(new ApiResponse(200, "Logged out successfully."));
  } catch (error) {
    // Log and handle any errors
    console.error("Error during logout: ", error);
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          error.message || "An Error Occurred while logging out."
        )
      );
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

    if (!user) return res.status(404).json(new ApiError(404, "User not found"));

    res
      .status(200)
      .json(new ApiResponse(200, "User fetched successfully.", user));
  } catch (err) {
    console.log("Error in getUserProfile: ", err.message);
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          err.message || "An error occurred while getting the user profile."
        )
      );
  }
};

const updateUser = async (req, res) => {
  const { name, email, username, password, bio } = req.body;
  const avatarPath = req.file?.path;
  // console.log(avatarPath);
  const userId = req.user._id;

  try {
    // * Attempt to find the user by ID
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found."));
    }

    if (avatarPath) {
      if (user.avatar) {
        await cloudinary.uploader.destroy(
          user.avatar.split("/").pop().split(".")[0]
        );
        // await cloudinary.uploader.destroy(user.avatar.split("/").pop());
      }
      const image = await uploadOnCloudinary(avatarPath);
      user.avatar = image.secure_url;
    }

    // Update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    // Update other fields only if they have been provided
    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;

    // Save the updated user information
    await user.save();

    // Return successful response with updated user data (excluding sensitive fields)
    user = await User.findById(userId).select("-password -__v");
    return res
      .status(200)
      .json(new ApiResponse(200, "User profile updated successfully.", user));
  } catch (error) {
    // Log and respond to any system errors
    console.error("Error updating user profile: ", err);
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          error.message || "An error occurred while updating the user profile."
        )
      );
  }
};

// get users by username/name by query search
const getUsers = async (req, res) => {
  const { query } = req.query;

  try {
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } },
      ],
    })
      .select("-password")
      .select("-createdAt")
      .select("-updatedAt")
      .select("-__v");
    res
      .status(200)
      .json(new ApiResponse(200, "Users fetched successfully", users));
  } catch (error) {
    console.error("Error in getUsers: ", error);
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          error.message || "An error occurred while fetching users."
        )
      );
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }

    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json(new ApiError(401, "Invalid password"));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();
    return res
      .status(200)
      .json(new ApiResponse(200, "Password changed successfully"));
  } catch (error) {
    console.error("Error in changePassword: ", error);
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          error.message || "An error occurred while changing password."
        )
      );
  }
};

const sendPasswordResetEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
    sendEmail(user.email, "Password Reset", resetUrl);
    return res
      .status(200)
      .json(new ApiResponse(200, "Password reset email sent successfully"));
  } catch (error) {
    console.error("Error in sendPasswordResetEmail: ", error);
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          error.message ||
            "An error occurred while sending password reset email."
        )
      );
  }
};

const resetPassword = async (req, res) => {
  const { password, token } = req.body;
  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    if (!userId) {
      return res.status(401).json(new ApiError(401, "Invalid token"));
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    await user.save();
    return res
      .status(200)
      .json(new ApiResponse(200, "Password reset successfully"));
  } catch (error) {
    console.error("Error in resetPassword: ", error);
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          error.message || "An error occurred while resetting password."
        )
      );
  }
};

export {
  signup,
  login,
  logout,
  updateUser,
  getUserProfile,
  getUsers,
  changePassword,
  sendPasswordResetEmail,
  resetPassword,
};
