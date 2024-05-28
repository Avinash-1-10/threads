import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      uinque: true,
    },
    email: {
      type: String,
      required: true,
      uinque: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    avatar: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    isVerfied: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin", "owner"],
      default: "user",
    },
    membershipStatus: {
      type: String,
      enum: ["basic", "premium", "pro"],
      default: "basic",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
