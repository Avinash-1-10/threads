import Repost from "../models/repost.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const getAllReposts = async (req, res) => {
  try {
    const reposts = await Repost.find();
    return res
      .status(200)
      .json(new ApiResponse(200, "Reposts fetched successfully", reposts));
  } catch (error) {
    console.log("Error in getAllReposts controller:", error.message);
    return res.status(500).json(new ApiError(500, error.message));
  }
};

const getRepostById = async (req, res) => {
  try {
    const repostId = new mongoose.Types.ObjectId(req.params.id);
    const repost = await Repost.aggregate([
      {
        $match: { _id: repostId },
      },
      {
        $lookup: {
          from: "users",
          localField: "repostBy",
          foreignField: "_id",
          as: "repostByDetails",
        },
      },
      {
        $unwind: "$repostByDetails",
      },
      {
        $lookup: {
          from: "posts",
          localField: "post",
          foreignField: "_id",
          as: "postDetails",
        },
      },
      {
        $unwind: "$postDetails",
      },
      {
        $lookup: {
          from: "users",
          localField: "postDetails.postBy",
          foreignField: "_id",
          as: "postByDetails",
        },
      },
      {
        $unwind: "$postByDetails",
      },
      {
        $project: {
          text: 1,
          image: 1,
          createdAt: 1,
          updatedAt: 1,
          type: 1,
          postDetails: 1,
          "postByDetails.name": 1,
          "postByDetails.username": 1,
          "postByDetails.avatar": 1,
          "postByDetails._id": 1,
          "repostByDetails.name": 1,
          "repostByDetails.username": 1,
          "repostByDetails.avatar": 1,
          "repostByDetails._id": 1,
        },
      },
    ]);
    if (!repost) {
      return res.status(400).json(new ApiError(400, "Repost not found"));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "Repost fetched successfully", repost[0]));
  } catch (error) {
    console.log("Error in getRepostById controller:", error.message);
    return res.status(500).json(new ApiError(500, error.message));
  }
};

const createRepost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;
    if (!postId || !text) {
      return res
        .status(400)
        .json(new ApiError(400, "Post id and text are required"));
    }
    const existingRepost = await Repost.findOne({
      post: postId,
      repostBy: userId,
    });
    if (existingRepost) {
      return res
        .status(400)
        .json(new ApiError(400, "You already reposted this post"));
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

const checkReposted = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;
    const repost = await Repost.findOne({ post: postId, repostBy: userId });
    if (repost) {
      return res.status(200).json({ isReposted: true });
    } else {
      return res.status(200).json({ isReposted: false });
    }
  } catch (error) {
    console.error("Error in checkReposted controller:", error.message);
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
};

export {
  createRepost,
  deleteRepost,
  getAllReposts,
  getRepostById,
  checkReposted,
};
