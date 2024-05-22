import express from "express";
import { createPoll } from "../controllers/poll.controller.js";
import verifyJwt from "../middlewares/auth.middleware.js";

const router = express.Router();


router.post("/", verifyJwt, createPoll);

export default router;