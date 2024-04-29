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

export { createPost, getPost, deletePost, getPostFeed };
