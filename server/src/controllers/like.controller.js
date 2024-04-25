import Comment from "../models/comment.model.js";
import CommentLike from "../models/commentLike.model.js";
import Post from "../models/post.model.js";
import PostLike from "../models/postLike.model.js";

const postLike = async (req, res) => {
  const userId = req.user._id;
  const postId = req.params.id;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const likedPost = await PostLike.findOne({ likedBy: userId, post: postId });
    if (likedPost) {
      await PostLike.findByIdAndDelete(likedPost._id);
      return res.status(200).json({ message: "Post disliked successfully" });
    } else {
      const newLike = new PostLike({
        likedBy: userId,
        post: postId,
      });
      await newLike.save();
      return res.status(200).json({ message: "Post liked successfully" });
    }
  } catch (error) {
    console.error("Error in postLike: ", error);
    return res
      .status(500)
      .json({ message: "An error occurred while processing your request" });
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
      const likedComment = await CommentLike.findOne({ likedBy: userId, comment: commentId });
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
      return res.status(500).json({ message: "An error occurred while processing your request" });
    }
  };

export { postLike, commentLike };
