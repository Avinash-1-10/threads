import mongoose from "mongoose";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import uploadOnCloudinary from "../utils/Cloudinary.js";

const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    const imgPath = req.file?.path;
    const postedBy = req.user._id;
    if (!postedBy || !text) {
      return res
        .status(400)
        .json(new ApiError(400, "Posted by and text are required"));
    }
    const user = await User.findById(postedBy);
    if (!user) {
      return res.status(400).json(new ApiError(400, "User not found"));
    }

    if (text.length > 500) {
      return res
        .status(400)
        .json(new ApiError(400, "Text should be less than 500 characters"));
    }

    const newPost = new Post({
      postBy: postedBy,
      text,
    });

    if (imgPath) {
      const result = await uploadOnCloudinary(imgPath);
      const image = result.secure_url;
      newPost.image = image;
    }

    await newPost.save();
    return res
      .status(201)
      .json(new ApiResponse(201, "Post created successfully", newPost));
  } catch (error) {
    console.log("Error in create post");
    return res.status(500).json(new ApiError(500, error.message));
  }
};

const getPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }

    return res.status(200).json({ message: "Post fetched successfully", post });
  } catch (error) {
    console.log("Error in get post");
    return res.status(500).json({ message: error.message });
  }
};

const getPostsByUser = async (req, res) => {
  try {
      const { username } = req.params;
      const user = await User.findOne({ username });
      if (!user) {
          return res.status(404).json({ error: "User not found", statusCode: 404 });
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
                  as: "postByDetails"
              }
          },
          {
              $unwind: "$postByDetails"
          },
          {
              $project: {
                  text: 1,
                  image: 1,
                  createdAt: 1,
                  updatedAt: 1,
                  'postByDetails.name': 1,
                  'postByDetails.username': 1,
                  'postByDetails.avatar': 1
              }
          }
      ]);

      if (posts.length === 0) {
          return res.status(404).json({ error: "No posts found", statusCode: 404 });
      }

      res.status(200).json({ message: "Posts fetched successfully", data: posts, statusCode: 200 });
  } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Error fetching posts", error: error.message, statusCode: 500 });
  }
};



const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }
    await Post.findByIdAndDelete(postId);
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("Error in delete post");
    return res.status(500).json({ message: error.message });
  }
};

const getPostFeed = async (req, res) => {
  const userId = req.user._id; // Assuming you have user information in req.user

  try {
    // Get the list of user IDs that this user is following
    const followingList = await Follow.find({ follower: userId }).select(
      "following -_id"
    );

    // Extract the user IDs into an array
    const followingUserIds = followingList.map((follow) => follow.following);

    // Query for posts where the postBy is in the followingUserIds
    const posts = await Post.find({
      postBy: { $in: followingUserIds },
    })
      .populate("postBy", "username avatar") // Populate the postBy field with the username and avatar from the User model
      .sort({ createdAt: -1 }) // Sort by creation time, newest first
      .limit(20); // Limit the number of posts for performance reasons

    return res.status(200).json({
      message: "Feed fetched successfully",
      posts,
    });
  } catch (error) {
    console.error("Error fetching post feed:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch post feed due to an internal error" });
  }
};

export { createPost, getPost, deletePost, getPostFeed, getPostsByUser };
