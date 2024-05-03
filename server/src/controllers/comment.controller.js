import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    const { text } = req.body;
    if (!text) {
      return res.status(400).json(new ApiError(400, "Text is required"));
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json(new ApiError(400, "Post not found"));
    }
    const newComment = new Comment({
      commentBy: userId,
      post: postId,
      text,
    });
    await newComment.save();
    return res
      .status(201)
      .json(new ApiResponse(201, "Comment created successfully", newComment));
  } catch (error) {
    console.error("Error in addComment: ", error);
    return res.status(500).json(new ApiError(500, error.message));
  }
};

const getCommentCount = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json(new ApiError(400, "Post not found"));
    }
    const commentCount = await Comment.countDocuments({ post: postId });
    const topComments = await Comment.find({ post: postId })
      .populate({
        path: "commentBy",
        select: "username avatar",
      })
      .limit(3);
    return res
      .status(200)
      .json(
        new ApiResponse(200, "Comment count fetched successfully", {
          commentCount,
          topComments,
        })
      );
  } catch (error) {
    console.error("Error in getCommentCount: ", error);
    return res.status(500).json(new ApiError(500, error.message));
  }
};

const getCommentsByPostId = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json(new ApiError(400, "Post not found"));
    }
    const comments = await Comment.find({ post: postId })
      .populate({
        path: "commentBy",
        select: "username avatar",
      })
      .sort({ createdAt: -1 });
    return res
      .status(200)
      .json(new ApiResponse(200, "Comments fetched successfully", comments));
  } catch (error) {
    console.error("Error in getCommentsByPostId: ", error);
    return res.status(500).json(new ApiError(500, error.message));
  }
}

export { addComment, getCommentCount, getCommentsByPostId };
