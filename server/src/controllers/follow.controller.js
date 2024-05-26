import Follow from "../models/follow.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const follow = async (req, res) => {
  try {
    const following = req.params.id;
    const follower = req.user._id;
    if (following === follower) {
      return res.status(400).json({ message: "You cant follow yourself" });
    }
    const followedAcc = await Follow.findOne({ follower, following });
    if (followedAcc) {
      await Follow.findOneAndDelete({ _id: followedAcc._id });
      return res.status(200).json({ message: "Unfollowed successfully" });
    }
    const newFollow = new Follow({
      follower,
      following,
    });
    await newFollow.save();
    return res.status(200).json({ message: "Followed successfully" });
  } catch (error) {
    console.error("Error in follow controller:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get the total count of followers for pagination or information
    const totalCount = await Follow.countDocuments({ following: userId });

    // Find the followers, limited to 10 for this query, and populate the follower details
    const followers = await Follow.find({ following: userId })
      .populate("follower")
      .limit(10);
    // Return the total count and the followers in the response
    return res.status(200).json(
      new ApiResponse(200, "Followers fetched successfully.", {
        totalCount,
        followers,
      })
    );
  } catch (error) {
    console.error("Error in getFollowers controller:", error.message);
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          error.message || "An error occurred while getting the user profile."
        )
      );
  }
};

const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;

    const totalCount = await Follow.countDocuments({ follower: userId });
    // Find all follows where the follower field matches the userId
    const following = await Follow.find({ follower: userId })
      .populate("follower")
      .limit(10);
    return res
      .status(200)
      .json(
        new ApiResponse(200, "Following fetched successfully.", {
          totalCount,
          following,
        })
      );
  } catch (error) {
    console.error("Error in getFollowing controller:", error.message);
    return res.status(500).json(new ApiError(500, error.message));
  }
};

const checkFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = req.user;
    const following = await Follow.findOne({
      follower: user._id,
      following: userId,
    });
    if (!following) {
      return res.status(200).json(new ApiResponse(200, "Not following", false));
    }
    return res.status(200).json(new ApiResponse(200, "Following", true));
  } catch (error) {
    console.error("Error in checkFollowing controller:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export { follow, getFollowers, getFollowing, checkFollowing };
