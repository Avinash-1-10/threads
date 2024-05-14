import express from "express";
import {
  createRepost,
  deleteRepost,
  getAllReposts,
  getRepostById,
} from "../controllers/repost.controller.js";
import verifyJwt from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", verifyJwt, createRepost);
router.get("/", getAllReposts);
router.get("/:id", getRepostById);
router.delete("/:id", verifyJwt, deleteRepost);

export default router;
