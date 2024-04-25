import Post from "../models/post.model.js";
import User from "../models/user.model.js";

const createPost = async (req, res) => {
  try {
    const { text, img } = req.body;
    const postedBy = req.user._id;
    if (!postedBy || !text) {
      return res
        .status(400)
        .json({ message: "Postedby and text fields are required" });
    }
    const user = await User.findById(postedBy);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (text.length > 500) {
      return res
        .status(400)
        .json({ message: "Text length should be less than 500" });
    }
    const newPost = new Post({
      postBy: postedBy,
      text,
    });
    await newPost.save();
    return res
      .status(201)
      .json({ message: "Post created successfully", newPost });
  } catch (error) {
    console.log("Error in create post");
    return res.status(500).json({ message: error.message });
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
    const followingList = await Follow.find({ follower: userId }).select('following -_id');

    // Extract the user IDs into an array
    const followingUserIds = followingList.map(follow => follow.following);

    // Query for posts where the postBy is in the followingUserIds
    const posts = await Post.find({
      postBy: { $in: followingUserIds }
    }).populate('postBy', 'username avatar') // Populate the postBy field with the username and avatar from the User model
    .sort({ createdAt: -1 }) // Sort by creation time, newest first
    .limit(20); // Limit the number of posts for performance reasons

    return res.status(200).json({
      message: "Feed fetched successfully",
      posts
    });
  } catch (error) {
    console.error("Error fetching post feed:", error);
    return res.status(500).json({ message: "Failed to fetch post feed due to an internal error" });
  }
};

export { createPost, getPost, deletePost, getPostFeed };
