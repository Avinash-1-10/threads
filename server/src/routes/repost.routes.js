import express from "express";
import { createRepost } from "../controllers/repost.controller.js";
import verifyJwt from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", verifyJwt, createRepost);



export default router;
