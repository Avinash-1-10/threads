import Comment from "../models/comment.model.js";
import CommentLike from "../models/commentLike.model.js";
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
    return res.status(200).json(
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
    const commentCount = await Comment.countDocuments({ post: postId });
    const comments = await Comment.find({ post: postId })
      .populate({
        path: "commentBy",
        select: "username avatar",
      })
      .sort({ createdAt: -1 });
    return res.status(200).json(
      new ApiResponse(200, "Comments fetched successfully", {
        comments,
        commentCount,
      })
    );
  } catch (error) {
    console.error("Error in getCommentsByPostId: ", error);
    return res.status(500).json(new ApiError(500, error.message));
  }
};

const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(400).json(new ApiError(400, "Comment not found"));
    }
    await Comment.findByIdAndDelete(commentId);
    return res
      .status(200)
      .json(new ApiResponse(200, "Comment deleted successfully"));
  } catch (error) {
    console.log("Error in deleteComment");
    return res.status(500).json(new ApiError(500, error.message));
  }
};

const likeComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(400).json(new ApiError(400, "Comment not found"));
    }

    const likedComment = await CommentLike.findOne({
      likedBy: userId,
      comment: commentId,
    });
    if (likedComment) {
      await CommentLike.findByIdAndDelete(likedComment._id);
      return res
        .status(200)
        .json(new ApiResponse(200, "Comment dislike successful"));
    }

    const newLike = new CommentLike({
      likedBy: userId,
      comment: commentId,
    });

    await newLike.save();
    return res
      .status(200)
      .json(new ApiResponse(200, "Comment liked successfully"));
  } catch (error) {
    console.error("Error in likeComment: ", error);
    return res.status(500).json(new ApiError(500, error.message));
  }
};

const getCommentLikesByCommentId = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(400).json(new ApiError(400, "Comment not found"));
    }
    const likeCount = await CommentLike.countDocuments({ comment: commentId });
    // check if user has liked the comment or not
    const likedComment = await CommentLike.findOne({
      likedBy: userId,
      comment: commentId,
    });
    return res.status(200).json(
      new ApiResponse(200, "Likes fetched successfully", {
        likeCount,
        liked: !!likedComment,
      })
    );
  } catch (error) {
    console.error("Error in getLikesByCommentId: ", error);
    return res.status(500).json(new ApiError(500, error.message));
  }
};

export {
  addComment,
  getCommentCount,
  getCommentsByPostId,
  deleteComment,
  likeComment,
  getCommentLikesByCommentId
};
