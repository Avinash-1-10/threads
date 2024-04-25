import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";

const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    const {text} = req.body;
    if(!text){
        return res.status(400).json({message:"Text field is required"});
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }
    const newComment = new Comment({
      commentBy: userId,
      post: postId,
      text
    });
    await newComment.save();
    return res
      .status(201)
      .json({ message: "Comment added successfully", newComment });
  } catch (error) {}
};


export {addComment}