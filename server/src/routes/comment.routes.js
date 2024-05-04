import { Router } from "express";
import verifyJwt from "../middlewares/auth.middleware.js";
import {
  addComment,
  deleteComment,
  getCommentCount,
  getCommentsByPostId,
} from "../controllers/comment.controller.js";

const router = Router();

router.post("/:id", verifyJwt, addComment);
router.get("/count/post/:postId", getCommentCount);
router.get("/post/:postId", getCommentsByPostId);
router.delete("/:id", verifyJwt, deleteComment);

export default router;
