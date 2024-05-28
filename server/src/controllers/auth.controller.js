import axios from "axios";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import generateTokenAndSetCookies from "../utils/helpers/generateTokenAndSetCookies.js";
import generatePassword from "generate-password";
import bcrypt from "bcryptjs"
import User from "../models/user.model.js";

// Initiates the Google OAuth2 authentication process.
export const initiateGoogleAuth = async (req, res) => {
  try {
    // Perform a GET request to Google's OAuth2 authentication URL with query parameters
    const response = await axios.get(
      "https://accounts.google.com/o/oauth2/v2/auth",
      {
        params: req.query,
      }
    );
    // Send the response from Google to the client
    res.send(response);
  } catch (error) {
    // If an error occurs during the request to Google, send a 500 Internal Server Error
    res.status(500).json(new ApiError(500, error.message));
  }
};

// Checks if the user login was successful and if the user exists in the database.
export const loginSuccess = async (req, res) => {
  if (req.user) {
    // Query the database for the user using the email provided by the Google user info
    const userExists = await User.findOne({
      email: req.user._json.email,
    }).select("-password -createdAt -updatedAt -__v");
    if (userExists) {
      //Generate token for user and set the cookies
      const threadsToken = generateTokenAndSetCookies(userExists._id, res);

      // If the user is found, send a successful response with the user data
      return res
        .status(200)
        .json(
          new ApiResponse(200, "Login Successful", {
            user: userExists,
            threadsToken,
          })
        );
    } else {
      // If no user is found in the database, respond with a 404 Not Found error
      const password = generatePassword.generate({
        length: 12,
        numbers: true,
        symbols: true,
        uppercase: true,
        lowercase: true
    });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        name: req.user._json.name,
        email: req.user._json.email,
        username: req.user._json.email.split("@")[0],
        avatar: req.user._json.picture,
        password: hashedPassword,
      });

      await newUser.save();
      const userData = await User.findById(newUser._id).select(
        "-password -createdAt -updatedAt -__v"
      );
      const threadsToken = generateTokenAndSetCookies(newUser._id, res);
      return res
        .status(200)
        .json(
          new ApiResponse(200, "Login Successful", {
            user: userData,
            threadsToken,
          })
        );
    }
  } else {
    // If no user info is available in the request, the login failed, respond with a 403 Forbidden
    return res.status(403).json(new ApiError(403, "Login Failed"));
  }
};

// Handles the scenario where user login has failed.
export const loginFailed = (req, res) => {
  // Respond with a 401 Unauthorized status to indicate the login failure
  return res.status(401).json(new ApiError(401, "Login Failed"));
};
