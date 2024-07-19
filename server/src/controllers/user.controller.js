import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import generateTokenAndSetCookies from '../utils/helpers/generateTokenAndSetCookies.js';
import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import uploadOnCloudinary from '../utils/Cloudinary.js';
import { v2 as cloudinary } from 'cloudinary';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';

const signup = async (req, res) => {
  try {
    // Extract relevant data from the request body
    const { name, email, username, password } = req.body;

    // Check for existing user by email or username
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      // If an existing user is found, respond with a 409 Conflict status code
      return res
        .status(409)
        .json(
          new ApiError(
            409,
            'An account with this email or username already exists.'
          )
        );
    }

    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10); // Generate a salt
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password with the salt

    // Create a new user instance with the hashed password
    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    // Retrieve the newly created user's data excluding sensitive fields
    const user = await User.findById(newUser._id).select(
      '-password -createdAt -updatedAt -__v'
    );

    // Generate a token and set cookies for the new user
    const threadsToken = generateTokenAndSetCookies(user._id, res);

    // Respond with a 201 Created status code, success message, and user data
    return res.status(201).json(
      new ApiResponse(201, 'Registration successful.', {
        user,
        threadsToken,
      })
    );
  } catch (error) {
    // Log the server error for debugging purposes
    console.error('Error during signup: ', error);

    // Respond with a 500 Internal Server Error status code and error message
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          error.message || 'An error occurred while registering.'
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
      // If user is not found, respond with a 404 Not Found status code
      return res.status(404).json(new ApiError(404, 'User not found.'));
    }

    // Check if the provided password matches the stored hash
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      // If password does not match, respond with a 401 Unauthorized status code
      return res.status(401).json(new ApiError(401, 'Invalid password.'));
    }

    // Fetch user data excluding sensitive details
    const userData = await User.findById(existingUser._id).select(
      '-password -createdAt -updatedAt -__v'
    );

    // Generate a token and set cookies for the user
    const threadsToken = generateTokenAndSetCookies(existingUser._id, res);

    // Successful login response with user data and token
    return res.status(200).json(
      new ApiResponse(200, 'Logged in successfully.', {
        user: userData,
        threadsToken,
      })
    );
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error in login: ', error);

    // Respond with a 500 Internal Server Error status code and error message
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          error.message || 'An Error Occurred while logging in.'
        )
      );
  }
};

const logout = async (req, res) => {
  try {
    // Clear the authentication token cookie by setting it to an empty string with a short expiration time
    res.cookie('threadsToken', '', { maxAge: 1 });

    // Respond with a success message indicating the user has been logged out
    return res
      .status(200)
      .json(new ApiResponse(200, 'Logged out successfully.'));
  } catch (error) {
    // Log any errors that occur during the logout process for debugging purposes
    console.error('Error during logout: ', error);

    // Respond with a 500 Internal Server Error status code and an appropriate error message
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          error.message || 'An Error Occurred while logging out.'
        )
      );
  }
};

const getUserProfile = async (req, res) => {
  // Extract the query parameter from the request
  const { query } = req.params;

  try {
    let user;

    // Check if the query is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(query)) {
      // If valid ObjectId, find the user by _id
      user = await User.findOne({ _id: query })
        .select('-password') // Exclude password field
        .select('-updatedAt'); // Exclude updatedAt field
    } else {
      // If not a valid ObjectId, find the user by username
      user = await User.findOne({ username: query })
        .select('-password') // Exclude password field
        .select('-updatedAt'); // Exclude updatedAt field
    }

    // If the user is not found, respond with a 404 Not Found status code
    if (!user) return res.status(404).json(new ApiError(404, 'User not found'));

    // If the user is found, respond with a 200 OK status code and user data
    res
      .status(200)
      .json(new ApiResponse(200, 'User fetched successfully.', user));
  } catch (err) {
    // Log any errors that occur during the process
    console.log('Error in getUserProfile: ', err.message);

    // Respond with a 500 Internal Server Error status code and error message
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          err.message || 'An error occurred while getting the user profile.'
        )
      );
  }
};

const updateUser = async (req, res) => {
  // Extract user information from the request body
  const { name, email, username, password, bio } = req.body;
  // Get the path of the uploaded avatar file (if any)
  const avatarPath = req.file?.path;
  // Get the user ID from the authenticated user
  const userId = req.user._id;

  try {
    // Attempt to find the user by ID
    let user = await User.findById(userId);
    if (!user) {
      // If the user is not found, respond with a 404 Not Found status code
      return res.status(404).json(new ApiError(404, 'User not found.'));
    }

    // If a new avatar path is provided
    if (avatarPath) {
      // If the user already has an avatar, delete the existing one from Cloudinary
      if (user.avatar) {
        await cloudinary.uploader.destroy(
          user.avatar.split('/').pop().split('.')[0]
        );
      }
      // Upload the new avatar to Cloudinary
      const image = await uploadOnCloudinary(avatarPath);
      // Update the user's avatar URL
      user.avatar = image.secure_url;
    }

    // Update the password if a new password is provided
    if (password) {
      // Generate a salt and hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      // Update the user's password
      user.password = hashedPassword;
    }

    // Update other fields only if they have been provided
    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;

    // Save the updated user information to the database
    await user.save();

    // Fetch the updated user data, excluding sensitive fields
    user = await User.findById(userId).select('-password -__v');

    // Respond with a success message and the updated user data
    return res
      .status(200)
      .json(new ApiResponse(200, 'User profile updated successfully.', user));
  } catch (error) {
    // Log any errors that occur during the update process
    console.error('Error updating user profile: ', error);
    // Respond with a 500 Internal Server Error status code and an error message
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          error.message || 'An error occurred while updating the user profile.'
        )
      );
  }
};

const getUsers = async (req, res) => {
  // Extract the query parameter from the request query string
  const { query } = req.query;

  try {
    // Search for users whose username or name matches the query, case insensitive
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } }, // Match usernames
        { name: { $regex: query, $options: 'i' } }, // Match names
      ],
    })
      // Exclude sensitive and unnecessary fields from the returned data
      .select('-password')
      .select('-createdAt')
      .select('-updatedAt')
      .select('-__v');

    // Respond with a 200 OK status code and the list of matched users
    res
      .status(200)
      .json(new ApiResponse(200, 'Users fetched successfully', users));
  } catch (error) {
    // Log any errors that occur during the search process
    console.error('Error in getUsers: ', error);

    // Respond with a 500 Internal Server Error status code and an appropriate error message
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          error.message || 'An error occurred while fetching users.'
        )
      );
  }
};

const changePassword = async (req, res) => {
  // Extract old and new passwords from the request body
  const { oldPassword, newPassword } = req.body;
  // Get the user ID from the authenticated user
  const userId = req.user._id;

  try {
    // Attempt to find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      // If the user is not found, respond with a 404 Not Found status code
      return res.status(404).json(new ApiError(404, 'User not found'));
    }

    // Compare the provided old password with the stored hashed password
    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordCorrect) {
      // If the old password is incorrect, respond with a 401 Unauthorized status code
      return res.status(401).json(new ApiError(401, 'Invalid password'));
    }

    // Generate a salt and hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    // Update the user's password with the hashed new password
    user.password = hashedPassword;
    // Save the updated user information to the database
    await user.save();

    // Respond with a success message
    return res
      .status(200)
      .json(new ApiResponse(200, 'Password changed successfully'));
  } catch (error) {
    // Log any errors that occur during the password change process
    console.error('Error in changePassword: ', error);
    // Respond with a 500 Internal Server Error status code and an appropriate error message
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          error.message || 'An error occurred while changing password.'
        )
      );
  }
};

const sendPasswordResetEmail = async (req, res) => {
  // Extract email from the request body
  const { email } = req.body;

  try {
    // Attempt to find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      // If the user is not found, respond with a 404 Not Found status code
      return res.status(404).json(new ApiError(404, 'User not found'));
    }

    // Generate a JWT token with the user's ID as payload, valid for 1 hour
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Create a password reset URL containing the token
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

    // Send the password reset email to the user
    sendEmail(user.email, 'Password Reset', resetUrl);

    // Respond with a success message
    return res
      .status(200)
      .json(new ApiResponse(200, 'Password reset email sent successfully'));
  } catch (error) {
    // Log any errors that occur during the process
    console.error('Error in sendPasswordResetEmail: ', error);

    // Respond with a 500 Internal Server Error status code and an appropriate error message
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          error.message ||
            'An error occurred while sending password reset email.'
        )
      );
  }
};

const resetPassword = async (req, res) => {
  // Extract password and token from the request body
  const { password, token } = req.body;

  try {
    // Verify the JWT token and extract the userId from the payload
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    if (!userId) {
      // If the token is invalid, respond with a 401 Unauthorized status code
      return res.status(401).json(new ApiError(401, 'Invalid token'));
    }

    // Attempt to find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      // If the user is not found, respond with a 404 Not Found status code
      return res.status(404).json(new ApiError(404, 'User not found'));
    }

    // Generate a salt and hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user's password with the hashed new password
    user.password = hashedPassword;

    // Save the updated user information to the database
    await user.save();

    // Respond with a success message
    return res
      .status(200)
      .json(new ApiResponse(200, 'Password reset successfully'));
  } catch (error) {
    // Log any errors that occur during the password reset process
    console.error('Error in resetPassword: ', error);

    // Respond with a 500 Internal Server Error status code and an appropriate error message
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          error.message || 'An error occurred while resetting password.'
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
