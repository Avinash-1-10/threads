import mongoose from "mongoose";

const repostSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      default: "repost",
    },
    repostBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    text: {
      type: String,
      maxLength: 500,
    },
  },
  { timestamps: true }
);

const Repost = mongoose.model("Repost", repostSchema);

export default Repost;
