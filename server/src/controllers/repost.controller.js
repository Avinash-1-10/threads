import Repost from "../models/repost.model.js";
import { ApiError } from "../utils/ApiError.js";

const createRepost = async (req, res) => {
  try {
    const { postId, text } = req.body;
    const userId = req.user._id;
    if (!postId || !text) {
      return res
        .status(400)
        .json(new ApiError(400, "Post id and text are required"));
    }
    const newRepost = new Repost({
      post: postId,
      repostBy: userId,
      text,
    });
    await newRepost.save();
    return res
      .status(200)
      .json(new ApiResponse(200, "Repost created successfully", newRepost));
  } catch (error) {
    console.error("Error in createRepost controller:", error.message);
    return res.status(500).json(new ApiError(500, error.message));
  }
};


const deleteRepost = async (req, res) => {
  try {
    const repostId = req.params.id;
    const repost = await Repost.findById(repostId);
    if (!repost) {
      return res.status(400).json(new ApiError(400, "Repost not found"));
    }
    await Repost.findByIdAndDelete(repostId);
    return res
      .status(200)
      .json(new ApiResponse(200, "Repost deleted successfully"));
  } catch (error) {
    console.log("Error in deleteRepost controller:", error.message);
    return res.status(500).json(new ApiError(500, error.message));
  }
}

export { createRepost, deleteRepost };
