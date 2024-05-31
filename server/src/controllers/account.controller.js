import Comment from "../models/comment.model.js";
import Poll from "../models/poll.model.js";
import Post from "../models/post.model.js";
import Repost from "../models/repost.model.js";
import User from "../models/user.model.js";
import Vote from "../models/vote.model.js";
import Follow from "../models/follow.model.js";
import CommentLike from "../models/commentLike.model.js";
import PostLike from "../models/postLike.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";

const deleteAccount = async (req, res) => {
  const { password } = req.body;
  try {
    if (!password) {
      return res.status(400).json(new ApiError(400, "Password is required"));
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json(new ApiError(401, "Invalid password"));
    }

    // delete user
    await User.findByIdAndDelete(user._id);

    // delete all comments by user
    await Comment.deleteMany({ commentBy: user._id });

    // delete all posts by user
    await Post.deleteMany({ postBy: user._id });

    // delete all reposts by user
    await Repost.deleteMany({ repostBy: user._id });

    // delete all polls by user
    await Poll.deleteMany({ createdBy: user._id });

    // delete all votes by user
    await Vote.deleteMany({ user: user._id });

    // delete all followers by user
    await Follow.deleteMany({ follower: user._id });

    // delete all following by user
    await Follow.deleteMany({ following: user._id });

    // delete all comment likes by user
    await CommentLike.deleteMany({ likedBy: user._id });

    // delete all post likes by user
    await PostLike.deleteMany({ likedBy: user._id });

    return res
      .status(200)
      .json(new ApiResponse(200, "Account deleted successfully"));
  } catch (error) {
    console.error("Error in deleteAccount controller:", error.message);
    return res.status(500).json(new ApiError(500, error.message));
  }
};

export { deleteAccount };
