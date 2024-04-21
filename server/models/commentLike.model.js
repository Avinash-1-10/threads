import mongoose from "mongoose";

const commentLikeSchema = new mongoose.Schema(
  {
    likedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      required: true,
    },
  },
  { timestamps: true }
);

const CommentLike = mongoose.model("CommentLike", commentLikeSchema);

export default CommentLike;
