import Poll from "../models/poll.model.js";
import Post from "../models/post.model.js";
import Repost from "../models/repost.model.js";
import User from "../models/user.model.js";
import Vote from "../models/vote.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const getFeed = async (req, res) => {
  try {
    const posts = await Post.aggregate([
      {
        $lookup: {
          from: "postlikes",
          localField: "_id",
          foreignField: "post",
          as: "likes",
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "post",
          as: "comments",
        },
      },
      {
        $addFields: {
          likeCount: { $size: "$likes" },
          commentCount: { $size: "$comments" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "postBy",
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
          "postByDetails.name": 1,
          "postByDetails.username": 1,
          "postByDetails.avatar": 1,
          "postByDetails._id": 1,
        },
      },
    ]);

    const reposts = await Repost.aggregate([
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

    const polls = await Poll.find({})
  .populate({
    path: "options",
    model: "Option",
  })
  .populate({
    path: "createdBy",
    model: "User",
    select: "name username avatar isVerfied",
  })
  .lean();


    // Loop through each poll and populate votes with vote count
    for (const poll of polls) {
      const votes = await Vote.find({ poll: poll._id });

      // Transform options with vote count
      poll.options = poll.options.map((option) => ({
        ...option,
        voteCount: votes.filter(
          (vote) => vote.option.toString() === option._id.toString()
        ).length,
      }));

      // Calculate total votes for the poll
      poll.totalVotes = votes.length;
    }

    // Merge posts and reposts into one array
    const feed = [...posts, ...reposts, ...polls];

    // Sort the feed by createdAt timestamp in descending order
    feed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res
      .status(200)
      .json(new ApiResponse(200, "Feed fetched successfully", feed));
  } catch (error) {
    console.error("Error fetching feed:", error);
    return res.status(500).json(new ApiError(500, "Failed to fetch feed"));
  }
};

const getUserFeed = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }
    const userId = user._id;
    const posts = await Post.aggregate([
      { $match: { postBy: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "postlikes",
          localField: "_id",
          foreignField: "post",
          as: "likes",
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "post",
          as: "comments",
        },
      },
      {
        $addFields: {
          likeCount: { $size: "$likes" },
          commentCount: { $size: "$comments" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "postBy",
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
          "postByDetails.name": 1,
          "postByDetails.username": 1,
          "postByDetails.avatar": 1,
          "postByDetails._id": 1,
        },
      },
    ]);

    // console.log(posts)

    const reposts = await Repost.aggregate([
      { $match: { repostBy: new mongoose.Types.ObjectId(userId) } },
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

    const polls = await Poll.find({createdBy: new mongoose.Types.ObjectId(userId)})
  .populate({
    path: "options",
    model: "Option",
  })
  .populate({
    path: "createdBy",
    model: "User",
    select: "name username avatar isVerfied",
  })
  .lean();

    // Loop through each poll and populate votes with vote count
    for (const poll of polls) {
      const votes = await Vote.find({ poll: poll._id });

      // Transform options with vote count
      poll.options = poll.options.map((option) => ({
        ...option,
        voteCount: votes.filter(
          (vote) => vote.option.toString() === option._id.toString()
        ).length,
      }));

      // Calculate total votes for the poll
      poll.totalVotes = votes.length;
    }
    // console.log(polls);
    // Merge posts and reposts into one array
    const feed = [...posts, ...reposts, ...polls];

    // Sort the feed by createdAt timestamp in descending order
    feed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res
      .status(200)
      .json(new ApiResponse(200, "Feed fetched successfully", feed));
  } catch (error) {
    console.error("Error fetching feed:", error);
    return res.status(500).json(new ApiError(500, "Failed to fetch feed"));
  }
};

export { getFeed, getUserFeed };
