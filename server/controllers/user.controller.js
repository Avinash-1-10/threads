import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookies from "../utils/helpers/generateTokenandSetCookies.js";

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

export { signup, login, logout };
