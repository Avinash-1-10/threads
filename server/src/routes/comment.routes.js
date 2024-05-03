import { Router } from "express";
import verifyJwt from "../middlewares/auth.middleware.js";
import { addComment, getCommentCount, getCommentsByPostId } from "../controllers/comment.controller.js";

const router = Router();

router.post("/:id", verifyJwt, addComment);
router.get("/count/post/:postId", getCommentCount);
router.get("/post/:postId", getCommentsByPostId);


export default router;