import { Router } from "express";
import verifyJwt from "../middlewares/auth.middleware.js";
import {
  addComment,
  addRepostComment,
  deleteComment,
  getCommentCount,
  getCommentLikesByCommentId,
  getCommentsByPostId,
  getRepostCommentCount,
  likeComment,
  getRepostCommentById
} from "../controllers/comment.controller.js";

const router = Router();

router.post("/:id", verifyJwt, addComment);
router.get("/count/post/:postId", getCommentCount);
router.get("/post/:postId", getCommentsByPostId);
router.delete("/:id", verifyJwt, deleteComment);
router.post("/like/:id", verifyJwt, likeComment);
router.get("/count/likes/:id", verifyJwt, getCommentLikesByCommentId);

router.get("/count/repost/:id", getRepostCommentCount);
router.get("/repost/:id", getRepostCommentById)
router.post("/repost/:id", verifyJwt, addRepostComment);

export default router;
