import { Router } from "express";
import verifyJwt from "../middlewares/auth.middleware.js";
import { createPost, deletePost, getPost } from "../controllers/post.controller.js";

const router = Router();

router.post("/create", verifyJwt, createPost);
router.get("/:id", getPost)
router.delete("/:id", deletePost)

export default router;