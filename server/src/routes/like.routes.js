import { Router } from "express";
import {
  commentLike,
  getPostLikes,
  getRepostLikes,
  postLike,
  repostLike,
} from "../controllers/like.controller.js";
import verifyJwt from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/post/:id", verifyJwt, postLike);
router.get("/count/post/:id", verifyJwt, getPostLikes);
router.post("/comment/:id", verifyJwt, commentLike);


router.post("/repost/:id", verifyJwt, repostLike);
router.get("/count/repost/:id", verifyJwt, getRepostLikes);

export default router;
