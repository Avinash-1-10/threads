import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const verifyJwt = async (req, res, next) => {
  try {
    // Extract token from either cookies or Authorization header
    const token =
      req.cookies?.threadsToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Unauthorized request" });
    }

    // Verify the JWT token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      return res.status(401).json({ message: "Invalid access token" });
    }

    // Retrieve user associated with the token
    const user = await User.findById(decodedToken.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach user object to the request for further processing
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in auth middleware:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default verifyJwt;
