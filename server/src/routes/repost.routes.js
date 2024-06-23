import express from "express";
import {
  checkReposted,
  createRepost,
  deleteRepost,
  getAllReposts,
  getRepostById,
} from "../controllers/repost.controller.js";
import verifyJwt from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:id", verifyJwt, createRepost);
router.get("/", getAllReposts);
router.get("/:id", getRepostById);
router.delete("/:id", verifyJwt, deleteRepost);
router.get("/check-reposted/:postId", verifyJwt, checkReposted);

export default router;
