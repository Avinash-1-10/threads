import Comment from "../models/comment.model.js";
import CommentLike from "../models/commentLike.model.js";
import Post from "../models/post.model.js";
import PostLike from "../models/postLike.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const postLike = async (req, res) => {
  const userId = req.user._id;
  const postId = req.params.id;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json(new ApiError(404, "Post not found"));
    }

    const likedPost = await PostLike.findOne({ likedBy: userId, post: postId });
    if (likedPost) {
      await PostLike.findByIdAndDelete(likedPost._id);
      return res
        .status(200)
        .json(new ApiResponse(200, "Post dislike successful"));
    } else {
      const newLike = new PostLike({
        likedBy: userId,
        post: postId,
      });
      await newLike.save();
      return res
        .status(200)
        .json(new ApiResponse(200, "Post liked successfully"));
    }
  } catch (error) {
    console.error("Error in postLike: ", error);
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          error.message || "An error occurred while processing your request"
        )
      );
  }
};

const commentLike = async (req, res) => {
  const userId = req.user._id;
  const commentId = req.params.id;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    const likedComment = await CommentLike.findOne({
      likedBy: userId,
      comment: commentId,
    });
    if (likedComment) {
      await CommentLike.findByIdAndDelete(likedComment._id);
      return res.status(200).json({ message: "Comment dislike successful" });
    } else {
      const newLike = new CommentLike({
        likedBy: userId,
        comment: commentId,
      });
      await newLike.save();
      return res.status(200).json({ message: "Comment liked successfully" });
    }
  } catch (error) {
    console.error("Error in commentLike: ", error);
    return res
      .status(500)
      .json({ message: "An error occurred while processing your request" });
  }
};

const getPostLikes = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;
  try {
    const likes = await PostLike.find({ post: postId }).limit(10);
    const likeCount = await PostLike.countDocuments({ post: postId });
    const userLike = await PostLike.findOne({ post: postId, likedBy: userId });
    const isLiked = !!userLike;
    return res.status(200).json(
      new ApiResponse(200, "Likes fetched successfully", {
        likes,
        likeCount,
        isLiked,
      })
    );
  } catch (error) {
    console.error("Error in getPostLikes: ", error);
    return res.status(500).json(new ApiError(500, error.message));
  }
};

export { postLike, commentLike, getPostLikes };
