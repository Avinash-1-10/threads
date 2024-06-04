import Follow from "../models/follow.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getUserDashboardDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -createdAt -updatedAt -__v"
    );

    // get all posts count for user
    const postCount = await Post.countDocuments({ postBy: req.user._id });

    // get followers count for user
    const followersCount = await Follow.countDocuments({
      following: req.user._id,
    });

    // get following count for user
    const followingCount = await Follow.countDocuments({
      follower: req.user._id,
    });

    return res.status(200).json(
      new ApiResponse(200, "User dashboard details fetched successfully", {
        user,
        postCount,
        followersCount,
        followingCount,
      })
    );
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.message));
  }
};

export { getUserDashboardDetails };
