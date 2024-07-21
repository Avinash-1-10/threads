import mongoose from 'mongoose';
import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import uploadOnCloudinary from '../utils/Cloudinary.js';
import Comment from '../models/comment.model.js';

// Controller function to create a new post
const createPost = async (req, res) => {
  try {
    // Destructure text from request body and image path from request file if available
    const { text } = req.body;
    const imgPath = req.file?.path;

    // Get the ID of the user posting from the request user object
    const postedBy = req.user._id;

    // Check if 'postedBy' and 'text' are present in the request, if not return a 400 error
    if (!postedBy || !text) {
      return res
        .status(400)
        .json(new ApiError(400, 'Posted by and text are required'));
    }

    // Find the user by ID to ensure they exist
    const user = await User.findById(postedBy);
    if (!user) {
      return res.status(400).json(new ApiError(400, 'User not found'));
    }

    // Validate the length of the post text, should be less than 500 characters
    if (text.length > 500) {
      return res
        .status(400)
        .json(new ApiError(400, 'Text should be less than 500 characters'));
    }

    // Create a new post object with the user ID and post text
    const newPost = new Post({
      postBy: postedBy,
      text,
    });

    // If an image path is provided, upload the image to Cloudinary
    if (imgPath) {
      const result = await uploadOnCloudinary(imgPath);
      const image = result.secure_url;

      // Set the image URL on the new post object
      newPost.image = image;
    }

    // Save the new post to the database
    await newPost.save();

    // Return a success response with the created post
    return res
      .status(201)
      .json(new ApiResponse(201, 'Post created successfully', newPost));
  } catch (error) {
    // Log any errors that occur during the post creation process
    console.log('Error in create post');

    // Return a 500 error response if an exception is thrown
    return res.status(500).json(new ApiError(500, error.message));
  }
};

// Controller function to get all posts
const getPosts = async (req, res) => {
  try {
    // Aggregate pipeline to fetch posts along with their related data
    const posts = await Post.aggregate([
      // Lookup stage to join the 'postlikes' collection and get likes for each post
      {
        $lookup: {
          from: 'postlikes',
          localField: '_id',
          foreignField: 'post',
          as: 'likes',
        },
      },
      // Lookup stage to join the 'comments' collection and get comments for each post
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'post',
          as: 'comments',
        },
      },
      // Add fields for like count and comment count
      {
        $addFields: {
          likeCount: { $size: '$likes' },
          commentCount: { $size: '$comments' },
        },
      },
      // Lookup stage to join the 'users' collection and get details of the user who posted
      {
        $lookup: {
          from: 'users',
          localField: 'postBy',
          foreignField: '_id',
          as: 'postByDetails',
        },
      },
      // Unwind the postByDetails array to deconstruct the array of user details
      {
        $unwind: '$postByDetails',
      },
      // Project stage to select specific fields to return in the response
      {
        $project: {
          text: 1,
          image: 1,
          createdAt: 1,
          updatedAt: 1,
          'postByDetails.name': 1,
          'postByDetails.username': 1,
          'postByDetails.avatar': 1,
          'postByDetails._id': 1,
        },
      },
      // Sort the posts by creation date in descending order
      {
        $sort: { createdAt: -1 },
      },
    ]);

    // Return a success response with the fetched posts
    return res
      .status(200)
      .json(new ApiResponse(200, 'Posts fetched successfully', posts));
  } catch (error) {
    // Log any errors that occur during the post fetching process
    console.log('Error in get posts');

    // Return a 500 error response if an exception is thrown
    return res.status(500).json(new ApiError(500, error.message));
  }
};

// Controller function to get a single post by its ID
const getPostById = async (req, res) => {
  try {
    // Extract the post ID from the request parameters
    const postId = req.params.id;

    // Find the post by ID and populate the 'postBy' field with user details
    const post = await Post.findById(postId).populate({
      path: 'postBy',
      select: 'name username avatar',
    });

    // If the post is not found, return a 400 error response
    if (!post) {
      return res.status(400).json({ message: 'Post not found' });
    }

    // Return a success response with the fetched post
    return res.status(200).json({ message: 'Post fetched successfully', post });
  } catch (error) {
    // Log any errors that occur during the post fetching process
    console.log('Error in get post');

    // Return a 500 error response if an exception is thrown
    return res.status(500).json({ message: error.message });
  }
};

// Controller function to get posts by a specific user
const getPostsByUser = async (req, res) => {
  try {
    // Extract the username from the request parameters
    const { username } = req.params;

    // Find the user by their username
    const user = await User.findOne({ username });

    // If the user is not found, return a 404 error response
    if (!user) {
      return res.status(404).json({ error: 'User not found', statusCode: 404 });
    }

    // Extract the user ID from the found user
    const userId = user._id;

    // Aggregate pipeline to fetch posts created by the user along with their related data
    const posts = await Post.aggregate([
      // Match stage to filter posts by the user ID
      { $match: { postBy: new mongoose.Types.ObjectId(userId) } },
      // Lookup stage to join the 'postlikes' collection and get likes for each post
      {
        $lookup: {
          from: 'postlikes',
          localField: '_id',
          foreignField: 'post',
          as: 'likes',
        },
      },
      // Lookup stage to join the 'comments' collection and get comments for each post
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'post',
          as: 'comments',
        },
      },
      // Add fields for like count and comment count
      {
        $addFields: {
          likeCount: { $size: '$likes' },
          commentCount: { $size: '$comments' },
        },
      },
      // Lookup stage to join the 'users' collection and get details of the user who posted
      {
        $lookup: {
          from: 'users',
          localField: 'postBy',
          foreignField: '_id',
          as: 'postByDetails',
        },
      },
      // Unwind the postByDetails array to deconstruct the array of user details
      {
        $unwind: '$postByDetails',
      },
      // Project stage to select specific fields to return in the response
      {
        $project: {
          text: 1,
          image: 1,
          createdAt: 1,
          updatedAt: 1,
          'postByDetails.name': 1,
          'postByDetails.username': 1,
          'postByDetails.avatar': 1,
          'postByDetails._id': 1,
        },
      },
    ]);

    // If no posts are found, return a 404 error response
    if (posts.length === 0) {
      return res.status(404).json({ error: 'No posts found', statusCode: 404 });
    }

    // Return a success response with the fetched posts
    res.status(200).json({
      message: 'Posts fetched successfully',
      data: posts,
      statusCode: 200,
    });
  } catch (error) {
    // Log any errors that occur during the post fetching process
    console.error('Error fetching posts:', error);

    // Return a 500 error response if an exception is thrown
    res.status(500).json({
      message: 'Error fetching posts',
      error: error.message,
      statusCode: 500,
    });
  }
};

// Controller function to delete a post by its ID
const deletePost = async (req, res) => {
  try {
    // Extract the post ID from the request parameters
    const postId = req.params.id;

    // Find the post by ID
    const post = await Post.findById(postId);

    // If the post is not found, return a 400 error response
    if (!post) {
      return res.status(400).json({ message: 'Post not found' });
    }

    // Delete all comments associated with the post
    await Comment.deleteMany({ post: postId });

    // Delete the post by ID
    await Post.findByIdAndDelete(postId);

    // Return a success response indicating the post was deleted
    return res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    // Log any errors that occur during the post deletion process
    console.log('Error in delete post');

    // Return a 500 error response if an exception is thrown
    return res.status(500).json({ message: error.message });
  }
};

// Controller function to get the post feed for the current user
const getPostFeed = async (req, res) => {
  // Assuming you have user information in req.user
  const userId = req.user._id;

  try {
    // Get the list of user IDs that this user is following
    const followingList = await Follow.find({ follower: userId }).select(
      'following -_id'
    );

    // Extract the user IDs into an array
    const followingUserIds = followingList.map((follow) => follow.following);

    // Query for posts where the postBy is in the followingUserIds
    const posts = await Post.find({
      postBy: { $in: followingUserIds },
    })
      // Populate the postBy field with the username and avatar from the User model
      .populate('postBy', 'username avatar')
      // Sort by creation time, newest first
      .sort({ createdAt: -1 })
      // Limit the number of posts for performance reasons
      .limit(20);

    // Return a success response with the fetched posts
    return res.status(200).json({
      message: 'Feed fetched successfully',
      posts,
    });
  } catch (error) {
    // Log any errors that occur during the post feed fetching process
    console.error('Error fetching post feed:', error);

    // Return a 500 error response if an exception is thrown
    return res.status(500).json({
      message: 'Failed to fetch post feed due to an internal error',
    });
  }
};

export {
  createPost,
  getPosts,
  getPostById,
  deletePost,
  getPostFeed,
  getPostsByUser,
};
