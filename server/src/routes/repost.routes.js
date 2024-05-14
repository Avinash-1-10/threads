import express from "express";
import { createRepost, deleteRepost } from "../controllers/repost.controller.js";
import verifyJwt from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", verifyJwt, createRepost);
router.delete("/:id", verifyJwt, deleteRepost);



export default router;
