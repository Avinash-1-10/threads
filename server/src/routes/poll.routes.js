import express from "express";
import { castVote, createPoll, getAllPolls } from "../controllers/poll.controller.js";
import verifyJwt from "../middlewares/auth.middleware.js";

const router = express.Router();


router.post("/", verifyJwt, createPoll);
router.get("/", getAllPolls);
router.post("/vote", verifyJwt, castVote);

export default router;