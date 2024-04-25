import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

const verifyJwt = async (req, res, next) => {
  try {
    // Extract the token from either cookies or Authorization header
    const token =
      req.cookies?.threadsToken ||
      req.headers["Authorization"]?.replace("Bearer ", "");

    if (!token) {
      // No token was found in either cookies or Authorization header
      return res
        .status(401)
        .json(
          new ApiError(401, "Access token is required for authentication.")
        );
    }

    // Verify and decode the JWT token using the secret key
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      // Decoding the token did not return a decoded object
      return res.status(401).json(new ApiError(401, "Invalid access token."));
    }

    // Retrieve the user associated with the decoded token
    const user = await User.findById(decodedToken.userId);
    if (!user) {
      // No user found linked to the token
      return res
        .status(404)
        .json(new ApiError(404, "User associated with the token not found."));
    }

    // Attach the user object to the request for use in subsequent middleware/functions
    req.user = user;
    next(); // Pass control to the next middleware
  } catch (error) {
    // Log the error and respond with a server error status
    console.error("JWT verification failed:", error.message);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json(new ApiError(401, "Invalid access token."));
    } else if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json(new ApiError(401, "Access token has expired."));
    } else {
      return res
        .status(500)
        .json(
          new ApiError(
            500,
            error.message || "Internal server error during token verification."
          )
        );
    }
  }
};

export default verifyJwt;
