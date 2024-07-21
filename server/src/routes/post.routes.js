import { Router } from "express";
import verifyJwt from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import {
  createPost,
  deletePost,
  getPostById,
  getPostFeed,
  getPosts,
  getPostsByUser,
} from "../controllers/post.controller.js";

// Create a new router instance
const router = Router();

// Route to create a new post, with JWT verification and image upload middleware
router.post("/create", verifyJwt, upload.single("image"), createPost);

// Route to get all posts
router.get("/", getPosts);

// Route to get a specific post by its ID
router.get("/:id", getPostById);

// Route to get all posts by a specific user, identified by their username
router.get("/user/:username", getPostsByUser);

// Route to delete a specific post by its ID
router.delete("/:id", deletePost);

// Route to get the post feed for the current user, with JWT verification
router.get("/feed", verifyJwt, getPostFeed);


export default router;
