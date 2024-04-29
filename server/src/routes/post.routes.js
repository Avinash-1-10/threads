import { Router } from "express";
import verifyJwt from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import {
  createPost,
  deletePost,
  getPost,
  getPostFeed,
  getPostsByUser,
} from "../controllers/post.controller.js";

const router = Router();

router.post("/create", verifyJwt, upload.single("image"), createPost);
router.get("/:id", getPost);
router.get("/user/:username", getPostsByUser);
router.delete("/:id", deletePost);
router.get("/feed", verifyJwt, getPostFeed);

export default router;
